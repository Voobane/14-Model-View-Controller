const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./config/connection");
const routes = require("./controllers");
const helpers = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({
  helpers,
  defaultLayout: "main",
  partialsDir: path.join(__dirname, "views/partials"),
});

// Configure session middleware
const sess = {
  secret: process.env.SESSION_SECRET || "Super secret secret",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Security middleware
app.use(session(sess));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files middleware
app.use(express.static(path.join(__dirname, "public")));

// Template engine setup
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Custom middleware for user state
app.use((req, res, next) => {
  res.locals.logged_in = req.session.logged_in;
  res.locals.user_id = req.session.user_id;
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    message: "Something broke!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Routes
app.use(routes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {
    message: "Page not found",
  });
});

// Database sync and server start
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
