const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Route to create a new comment (POST /api/comments)
router.post("/", withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      post_id: req.body.post_id, // Post ID for which the comment is made
      user_id: req.session.user_id, // Associate the comment with the logged-in user
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a comment by ID (DELETE /api/comments/:id)
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id, // Ensure the logged-in user owns the comment
      },
    });

    if (!commentData) {
      res
        .status(404)
        .json({ message: "No comment found with this id or not authorized" });
      return;
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
