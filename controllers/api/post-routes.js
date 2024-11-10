const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// GET /api/posts - Get all posts
router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username"],
        },
        {
          model: Comment,
          include: {
            model: User,
            as: "author",
            attributes: ["username"],
          },
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.json(postData);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json(err);
  }
});

// GET /api/posts/:id - Get single post
router.get("/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username"],
        },
        {
          model: Comment,
          include: {
            model: User,
            as: "author",
            attributes: ["username"],
          },
        },
      ],
    });

    if (!postData) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }

    // Increment view count
    await postData.increment("view_count");
    res.json(postData);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json(err);
  }
});

// POST /api/posts - Create new post
// Create new post
router.post("/", withAuth, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
      res
        .status(400)
        .json({ message: "Please provide both title and content" });
      return;
    }

    const newPost = await Post.create({
      title,
      content,
      user_id: req.session.user_id,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// PUT /api/posts/:id - Update post
router.put("/:id", withAuth, async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }

    if (!post.isOwner(req.session.user_id)) {
      res.status(403).json({ message: "Not authorized to edit this post" });
      return;
    }

    const updatedPost = await post.update({
      title,
      content,
      status,
    });

    res.json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json(err);
  }
});

// DELETE /api/posts/:id - Delete post
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }

    if (!post.isOwner(req.session.user_id)) {
      res.status(403).json({ message: "Not authorized to delete this post" });
      return;
    }

    await post.destroy();
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json(err);
  }
});

// POST /api/posts/:id/comments - Add comment
router.post("/:id/comments", withAuth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ message: "Comment content is required" });
      return;
    }

    const post = await Post.findByPk(req.params.id);
    if (!post) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }

    const newComment = await Comment.create({
      content,
      post_id: req.params.id,
      user_id: req.session.user_id,
    });

    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username"],
        },
      ],
    });

    res.status(201).json(commentWithUser);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json(err);
  }
});

module.exports = router;
