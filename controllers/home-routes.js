const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// Homepage route - displays all posts
router.get("/", async (req, res) => {
  try {
    // Fetch all posts and include the user who created each post
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Render the homepage and pass the posts and logged_in status
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in, // Pass the logged-in status
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Individual post route - displays a specific post
router.get("/post/:id", async (req, res) => {
  try {
    // Find the post by its ID, including the user's username and comments
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    // If no post is found, return 404
    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    // Serialize data so the template can read it
    const post = postData.get({ plain: true });

    // Render the post page and pass the post and logged_in status
    res.render("post", {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login route
router.get("/login", (req, res) => {
  // If the user is already logged in, redirect them to the homepage
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  // Render the login page if not logged in
  res.render("login");
});

// Sign up route
router.get("/signup", (req, res) => {
  // If the user is already logged in, redirect to the homepage
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  // Render the signup page if not logged in
  res.render("signup");
});

module.exports = router;
