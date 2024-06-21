const express = require('express');
const router = express.Router();
const {createComment, getComments, likeComment} = require('../controllers/comment.controller');
const verifyUser = require('../utils/verifyUser');

router.post('/create', verifyUser, createComment);
router.get('/getcomments/:postId', getComments);
router.put('/likecomment/:commentId', verifyUser, likeComment);

module.exports = router;