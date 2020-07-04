const express = require('express');
const router = express.Router();
const postController = require('../controllers/post_controller');



//send post data to DB
router.post('/create', postController.create);


module.exports = router;