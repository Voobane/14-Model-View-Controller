const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./homecontroller');
const dashboardRoutes = require('./dashboardcontroller');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
 