const router = require("express").Router();
const { User } = require("../../models");
const bcrypt = require("bcrypt");

// Signup route
router.post("/signup", async (req, res) => {
  try {
    // Create a new user with the data provided in the request body
    const userData = await User.create({
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
    });

    // Save the session and set the logged_in status
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    // Find the user by username
    const userData = await User.findOne({
      where: { username: req.body.username },
    });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect username or password, please try again" });
      return;
    }

    // Check if the password matches
    const validPassword = await bcrypt.compare(
      req.body.password,
      userData.password
    );

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect username or password, please try again" });
      return;
    }

    // Save session and set the logged_in status
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Logout route
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    // Destroy the session to log the user out
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
