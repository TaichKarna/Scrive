const express = require('express');
const router = express.Router();
const verifyUser = require('../utils/verifyUser')
const {createPost, getPosts, deletePost} = require('../controllers/post.controller');

router.post('/create', verifyUser, createPost);
router.get('/getposts', getPosts);
router.delete('/deletepost/:postId/:userId', verifyUser,  deletePost)
module.exports = router;