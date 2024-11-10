const router = require("express").Router();
const apiRoutes = require("./api");
const homeRoutes = require("./home-routes");
const dashboardRoutes = require("./dashboard-routes");

// Use route handlers
router.use("/", homeRoutes);
router.use("/api", apiRoutes);
router.use("/dashboard", dashboardRoutes);

// Catch-all route for undefined paths
router.use((req, res) => {
  res.status(404).render("404", {
    message: "Page not found",
    logged_in: req.session.logged_in,
    title: "404 Not Found",
  });
});

module.exports = router;
