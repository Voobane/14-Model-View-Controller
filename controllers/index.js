const router = require('express').Router();
const apiRoutes = require('./api'); // This line is likely causing the error
const homeRoutes = require('./homeController');
const dashboardRoutes = require('./dashboardController');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
