const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const { Op } = require("sequelize");
const withAuth = require("../utils/auth");

// GET / - Homepage with posts
router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { status: "published" },
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
        },
      ],
      order: [["created_at", "DESC"]],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("home", {
      posts,
      logged_in: req.session.logged_in,
      username: req.session.username,
      isHome: true, // For navigation active state
    });
  } catch (err) {
    console.error("Error loading homepage:", err);
    res.status(500).render("error", { error: "Failed to load posts" });
  }
});

// GET /login - Login page
router.get("/login", (req, res) => {
  // Redirect to dashboard if already logged in
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login", {
    title: "Login",
    isLogin: true,
    logged_in: false,
  });
});

// GET /signup - Signup page
router.get("/signup", (req, res) => {
  // Redirect to dashboard if already logged in
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("signup", {
    title: "Sign Up",
    isSignup: true,
    logged_in: false,
  });
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
      res.status(404).render("404", {
        message: "Post not found",
        logged_in: req.session.logged_in,
      });
      return;
    }

    // Increment view count if not the author
    if (!req.session.user_id || req.session.user_id !== postData.user_id) {
      await postData.increment("view_count");
    }

    const post = postData.get({ plain: true });

    res.render("single-post", {
      title: post.title,
      post,
      logged_in: req.session.logged_in,
      username: req.session.username,
      user_id: req.session.user_id,
      is_owner: req.session.user_id === post.user_id,
    });
  } catch (err) {
    console.error("Error loading post:", err);
    res.status(500).render("error", {
      error: "Failed to load post",
      logged_in: req.session.logged_in,
    });
  }
});

// GET /search - Search posts
router.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Posts per page
    const offset = (page - 1) * limit;

    if (!searchTerm) {
      res.redirect("/");
      return;
    }

    const { count, rows: postData } = await Post.findAndCountAll({
      where: {
        status: "published",
        [Op.or]: [
          { title: { [Op.iLike]: `%${searchTerm}%` } },
          { content: { [Op.iLike]: `%${searchTerm}%` } },
        ],
      },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username"],
        },
        {
          model: Comment,
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    // Calculate pagination
    const totalPages = Math.ceil(count / limit);
    const pagination = {
      current: page,
      total: totalPages,
      prev: page > 1 ? page - 1 : null,
      next: page < totalPages ? page + 1 : null,
    };

    res.render("search", {
      title: `Search: ${searchTerm}`,
      searchTerm,
      posts,
      pagination,
      count,
      logged_in: req.session.logged_in,
      username: req.session.username,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).render("error", {
      error: "Failed to perform search",
      logged_in: req.session.logged_in,
    });
  }
});

// GET /logout - Logout user
router.get("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

// GET /about - About page
router.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    isAbout: true,
    logged_in: req.session.logged_in,
    username: req.session.username,
  });
});

// GET /contact - Contact page
router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact",
    isContact: true,
    logged_in: req.session.logged_in,
    username: req.session.username,
  });
});

module.exports = router;
