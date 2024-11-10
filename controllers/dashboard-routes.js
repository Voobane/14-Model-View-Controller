const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// GET /dashboard - User's dashboard
router.get("/", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: [{ model: Comment }],
      order: [["created_at", "DESC"]],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("dashboard", {
      posts,
      logged_in: true,
      username: req.session.username,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET /dashboard/new - New post form
router.get("/new", withAuth, (req, res) => {
  res.render("new-post", {
    logged_in: true,
    username: req.session.username,
  });
});

module.exports = router;
