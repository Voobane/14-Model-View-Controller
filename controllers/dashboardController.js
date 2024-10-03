const router = require('express').Router();
const { Post } = require('../models');
const withAuth = require('../utils/auth');

// Get all posts for the logged-in user and render the dashboard
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { userId: req.session.user_id },
    });
    const posts = postData.map((post) => post.get({ plain: true }));
    res.render('dashboard', { posts, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
