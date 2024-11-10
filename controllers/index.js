const router = require("express").Router();
const apiRoutes = require("./api");
const homeRoutes = require("./home-routes");
const dashboardRoutes = require("./dashboard-routes");

// API routes
router.use("/api", apiRoutes);

// View routes
router.use("/", homeRoutes);
router.use("/dashboard", dashboardRoutes);

// 404 handler
router.use((req, res) => {
  res.status(404).render("404", {
    message: "Page not found",
    logged_in: req.session.logged_in,
  });
});

module.exports = router;
