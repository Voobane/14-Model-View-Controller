const router = require("express").Router();
const { Comment, User } = require("../../models");
const withAuth = require("../../utils/auth");

// PUT /api/comments/:id - Update comment
router.put("/:id", withAuth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ message: "Comment content is required" });
      return;
    }

    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      res.status(404).json({ message: "No comment found with this id" });
      return;
    }

    if (!comment.isOwner(req.session.user_id)) {
      res.status(403).json({ message: "Not authorized to edit this comment" });
      return;
    }

    const updatedComment = await comment.update({ content });

    const commentWithUser = await Comment.findByPk(updatedComment.id, {
      include: [{ model: User, as: "author", attributes: ["username"] }],
    });

    res.json(commentWithUser);
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json(err);
  }
});

// DELETE /api/comments/:id - Delete comment
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      res.status(404).json({ message: "No comment found with this id" });
      return;
    }

    if (!comment.isOwner(req.session.user_id)) {
      res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
      return;
    }

    await comment.destroy();
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
