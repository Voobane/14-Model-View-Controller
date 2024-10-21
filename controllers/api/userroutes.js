const router = require('express').Router();
const { User } = require('../../models');

// POST /api/users/signup - Create a new user //<<<< THIS IS IT - THE ISSUE
router.post('/signup', async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;
      res.status(200).json(newUser);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST /api/users/login - User login   //<<<< THIS IS IT - THE ISSUE
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (!user || !(await user.checkPassword(req.body.password))) {
      res.status(400).json({ message: 'Incorrect username or password!' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
      res.json({ user });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST /api/users/logout - User logout 
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
