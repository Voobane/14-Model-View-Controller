const router = require("express").Router();
const { User } = require("../../models");
const withAuth = require("../../utils/auth");

// Rate limiting for login attempts
const loginAttempts = new Map();

// Login rate limit checker
const checkLoginAttempts = async (username) => {
  const attempts = loginAttempts.get(username) || {
    count: 0,
    timestamp: Date.now(),
  };
  const timeWindow = 15 * 60 * 1000; // 15 minutes

  if (Date.now() - attempts.timestamp > timeWindow) {
    loginAttempts.set(username, { count: 1, timestamp: Date.now() });
    return true;
  }

  if (attempts.count >= 5) {
    return false;
  }

  attempts.count++;
  loginAttempts.set(username, attempts);
  return true;
};

// POST /api/users/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      res
        .status(400)
        .json({ message: "Please provide both username and password" });
      return;
    }

    // Check if username exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }

    const newUser = await User.create({
      username,
      password,
      last_login: new Date(),
    });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.logged_in = true;
      req.session.username = newUser.username;
      res.status(201).json(newUser.toPublicJSON());
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Failed to create account" });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      res
        .status(400)
        .json({ message: "Please provide both username and password" });
      return;
    }

    // Check rate limiting
    if (!(await checkLoginAttempts(username))) {
      res
        .status(429)
        .json({ message: "Too many login attempts. Please try again later." });
      return;
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      res.status(400).json({ message: "Incorrect username or password" });
      return;
    }

    const validPassword = await user.checkPassword(password);

    if (!validPassword) {
      await user.increment("login_attempts");
      res.status(400).json({ message: "Incorrect username or password" });
      return;
    }

    // Reset login attempts on successful login
    await user.update({
      login_attempts: 0,
      last_login: new Date(),
      account_locked_until: null,
    });

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
      req.session.username = user.username;
      res.json({ user: user.toPublicJSON(), message: "Login successful!" });
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

// POST /api/users/logout
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// GET /api/users/check-auth
router.get("/check-auth", (req, res) => {
  if (req.session.logged_in) {
    res.json({
      logged_in: true,
      user_id: req.session.user_id,
      username: req.session.username,
    });
  } else {
    res.json({ logged_in: false });
  }
});

module.exports = router;
