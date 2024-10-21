const router = require("express").Router();
const { Post } = require("../../models");
const withAuth = require("../../utils/auth");

// Route to create a new post (POST /api/posts)
router.post("/", withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id, // Associate the post with the logged-in user
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to update an existing post by ID (PUT /api/posts/:id)
router.put("/:id", withAuth, async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id, // Ensure the logged-in user owns the post
        },
      }
    );

    if (!updatedPost[0]) {
      res
        .status(404)
        .json({ message: "No post found with this id or not authorized" });
      return;
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a post by ID (DELETE /api/posts/:id)
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id, // Ensure the logged-in user owns the post
      },
    });

    if (!postData) {
      res
        .status(404)
        .json({ message: "No post found with this id or not authorized" });
      return;
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
