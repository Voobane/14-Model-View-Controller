const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// GET /dashboard - User's dashboard
router.get("/", withAuth, async (req, res) => {
  try {
    // Get all posts for the logged-in user
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: [
        {
          model: Comment,
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Serialize data
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render dashboard
    res.render("dashboard", {
      posts,
      logged_in: true,
      username: req.session.username,
      isDashboard: true,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).render("error", {
      error: "Failed to load dashboard",
      logged_in: req.session.logged_in,
    });
  }
});

// GET /dashboard/new - New post form
router.get("/new", withAuth, (req, res) => {
  res.render("new-post", {
    logged_in: true,
    username: req.session.username,
    isDashboard: true,
  });
});

// GET /dashboard/edit/:id - Edit post form
router.get("/edit/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);

    if (!postData) {
      res.status(404).render("404", {
        message: "Post not found",
        logged_in: req.session.logged_in,
      });
      return;
    }

    const post = postData.get({ plain: true });

    if (post.user_id !== req.session.user_id) {
      res.status(403).render("error", {
        error: "You are not authorized to edit this post",
        logged_in: req.session.logged_in,
      });
      return;
    }

    res.render("edit-post", {
      post,
      logged_in: true,
      username: req.session.username,
      isDashboard: true,
    });
  } catch (err) {
    console.error("Edit post error:", err);
    res.status(500).render("error", {
      error: "Failed to load edit page",
      logged_in: req.session.logged_in,
    });
  }
});

module.exports = router;
