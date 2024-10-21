const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/authentication');


// POST /api/posts - Create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.session.user_id,
    });
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE /api/posts/:id - Delete a post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: { id: req.params.id, userId: req.session.user_id },
    });
    if (!postData) {
      res.status(404).json({ message: 'No post found!' });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;



// login router is missing
// alos make all folders lowercase