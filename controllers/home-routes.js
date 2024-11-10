const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// GET / - Homepage
router.get("/", async (req, res) => {
  try {
    // Get all posts with associated user and comment count
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username"],
        },
        {
          model: Comment,
          attributes: ["id"],
        },
      ],
      where: { status: "published" },
      order: [["created_at", "DESC"]],
    });

    const posts = postData.map((post) => ({
      ...post.get({ plain: true }),
      commentCount: post.comments.length,
    }));

    res.render("home", {
      posts,
      logged_in: req.session.logged_in,
      username: req.session.username,
    });
  } catch (err) {
    console.error("Error loading homepage:", err);
    res.status(500).render("error", { error: "Failed to load posts" });
  }
});

// GET /post/:id - Single post view
router.get("/post/:id", async (req, res) => {
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
          include: [
            {
              model: User,
              as: "author",
              attributes: ["username"],
            },
          ],
          order: [["created_at", "DESC"]],
        },
      ],
    });

    if (!postData) {
      res.status(404).render("404", { message: "Post not found" });
      return;
    }

    const post = postData.get({ plain: true });

    // Increment view count
    await postData.increment("view_count");

    res.render("single-post", {
      post,
      logged_in: req.session.logged_in,
      username: req.session.username,
      is_owner: req.session.user_id === post.user_id,
    });
  } catch (err) {
    console.error("Error loading post:", err);
    res.status(500).render("error", { error: "Failed to load post" });
  }
});

// GET /login - Login page
router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});

// GET /signup - Signup page
router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signup");
});

module.exports = router;
