const express = require('express')
const userController = require('../controllers/user.controller')
const verifyUser = require('../utils/verifyUser')
const router = express.Router();

router.get('/test',userController.test);
router.put('/update/:userId',verifyUser,userController.updateUser);
router.delete('/delete/:userId',verifyUser,userController.deleteUser);

module.exports = router