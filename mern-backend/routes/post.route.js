const express = require('express');
const router = express.Router();
const verifyUser = require('../utils/verifyUser')
const {createPost, getPosts} = require('../controllers/post.controller');

router.post('/create',verifyUser,createPost);
router.get('/getposts',getPosts);

module.exports = router;