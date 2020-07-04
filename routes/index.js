const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const postController = require('../controllers/post_controller');

router.get('/', postController.posts);
router.use('/users', require('./users'));


//for any other routes, access from here
// router.use('/routerName', require('filename'))
router.use('/posts',require('./posts'))




//It will export all the routes
module.exports = router;