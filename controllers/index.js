const router = require("express").Router();
const apiRoutes = require("./api");
const homeRoutes = require("./home-routes.js");
const dashboardRoutes = require("./dashboard-routes.js");

// Use routes
router.use("/", homeRoutes);
router.use("/api", apiRoutes);
router.use("/dashboard", dashboardRoutes);

// Catch 404s and forward to error handler
router.use((req, res) => {
  res.status(404).render("404", {
    title: "404 Not Found",
    message: "The page you requested could not be found.",
    logged_in: req.session?.logged_in || false,
  });
});

module.exports = router;
