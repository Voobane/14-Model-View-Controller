const router = require('express').Router();
const postRoutes = require('./postroutes');
const userRoutes = require('./userroutes');

router.use('/posts', postRoutes);
router.use('/users', userRoutes);

module.exports = router;
