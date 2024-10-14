const withAuth = (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect('/login'); //<<< make sure this is correct show got o log.handlebars
  } else {
    next();
  }
};

module.exports = withAuth;
