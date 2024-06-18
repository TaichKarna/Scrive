const express = require('express')
const userController = require('../controllers/user.controller')
const verifyUser = require('../utils/verifyUser')
const router = express.Router();

router.get('/test',userController.test)
router.put('/update/:userId',verifyUser,userController.updateUser)
module.exports = router