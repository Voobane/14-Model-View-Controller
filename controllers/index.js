const router = require('express').Router();
const homeRoutes = require('./homeController');
const dashboardRoutes = require('./dashboardController');
const apiRoutes = require('./api');

router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/api', apiRoutes);

module.exports = router;
