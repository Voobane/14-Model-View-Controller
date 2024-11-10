const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// GET /dashboard - User's dashboard
router.get("/", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: [
        {
          model: Comment,
          attributes: ["id"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const posts = postData.map((post) => ({
      ...post.get({ plain: true }),
      commentCount: post.comments.length,
    }));

    res.render("dashboard", {
      posts,
      logged_in: true,
      username: req.session.username,
    });
  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.status(500).render("error", { error: "Failed to load dashboard" });
  }
});

// GET /dashboard/new - New post form
router.get("/new", withAuth, (req, res) => {
  res.render("new-post", {
    logged_in: true,
    username: req.session.username,
  });
});

// GET /dashboard/edit/:id - Edit post form
router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);

    if (!postData) {
      res.status(404).render("404", { message: "Post not found" });
      return;
    }

    const post = postData.get({ plain: true });

    if (post.user_id !== req.session.user_id) {
      res.redirect("/dashboard");
      return;
    }

    res.render("edit-post", {
      post,
      logged_in: true,
      username: req.session.username,
    });
  } catch (err) {
    console.error("Error loading edit form:", err);
    res.status(500).render("error", { error: "Failed to load edit form" });
  }
});

module.exports = router;
