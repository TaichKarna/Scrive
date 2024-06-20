const express = require('express');
const router = express.Router();
const verifyUser = require('../utils/verifyUser')
const {createPost, getPosts, deletePost, updatePost} = require('../controllers/post.controller');

router.post('/create', verifyUser, createPost);
router.get('/getposts', getPosts);
router.delete('/deletepost/:postId/:userId', verifyUser,  deletePost)
router.put('/update-post/:postId/:userId',verifyUser, updatePost);

module.exports = router;