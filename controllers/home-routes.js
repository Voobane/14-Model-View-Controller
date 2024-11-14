const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const { Op } = require("sequelize");
const withAuth = require("../utils/auth");

// GET / - Homepage with optional pagination and search
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Posts per page
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    // Build where clause
    const whereClause = {
      status: "published",
      ...(search && {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    // Get posts with pagination
    const { count, rows: postData } = await Post.findAndCountAll({
      where: whereClause,
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
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const posts = postData.map((post) => ({
      ...post.get({ plain: true }),
      commentCount: post.comments.length,
    }));

    // Calculate pagination
    const totalPages = Math.ceil(count / limit);
    const pagination = {
      current: page,
      total: totalPages,
      prev: page > 1 ? page - 1 : null,
      next: page < totalPages ? page + 1 : null,
    };

    res.render("home", {
      posts,
      pagination,
      search,
      logged_in: req.session.logged_in,
      username: req.session.username,
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
    logged_in: false,
  });
});

// GET /post/:id - Single post view with view count tracking
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

    const post = postData.get({ plain: true });

    // Increment view count if not author
    if (!req.session.user_id || req.session.user_id !== post.user_id) {
      await postData.increment("view_count");
    }

    res.render("single-post", {
      post,
      logged_in: req.session.logged_in,
      username: req.session.username,
      user_id: req.session.user_id,
      is_owner: req.session.user_id === post.user_id,
    });
  } catch (err) {
    console.error("Error loading post:", err);
    res.status(500).render("error", { error: "Failed to load post" });
  }
});

// GET /logout - Logout and redirect to home
router.get("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
