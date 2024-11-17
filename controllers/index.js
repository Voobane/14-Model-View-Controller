const router = require("express").Router();
const apiRoutes = require("./api");
const homeRoutes = require("./home-routes");
const dashboardRoutes = require("./dashboard-routes");

// Use routes
router.use("/", homeRoutes);
router.use("/api", apiRoutes);
router.use("/dashboard", dashboardRoutes);

// Catch 404s
router.use((req, res) => {
  res.status(404).render("404", {
    title: "404 Not Found",
    message: "The page you requested could not be found.",
    logged_in: req.session.logged_in,
  });
});

// Error handler
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Error",
    error: "Something went wrong!",
    logged_in: req.session.logged_in,
  });
});

module.exports = router;
