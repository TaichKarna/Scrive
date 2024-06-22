const express = require('express');
const router = express.Router();
const {createComment, getComments, likeComment, editComment, deleteComment, getAllComments} = require('../controllers/comment.controller');
const verifyUser = require('../utils/verifyUser');

router.post('/create', verifyUser, createComment);
router.get('/getcomments', verifyUser,getAllComments);
router.get('/getcomments/:postId', getComments);
router.put('/likecomment/:commentId', verifyUser, likeComment);
router.put('/editcomment/:commentId', verifyUser, editComment);
router.delete('/deletecomment/:commentId/:userId', verifyUser, deleteComment);

module.exports = router;