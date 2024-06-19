const express = require('express');
const router = express.Router();
const verifyUser = require('../utils/verifyUser')
const {createPost} = require('../controllers/post.controller');

router.post('/create',verifyUser,createPost);

module.exports = router;