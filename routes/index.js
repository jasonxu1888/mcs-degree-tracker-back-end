const express = require('express');
const router  = express.Router();

const userController = require('../controllers/user');


router.get('/user', userController.getAllUser);
router.post('/user', userController.newUser);
router.delete('/user', userController.deleteAllUser);
router.get('/user/:name', userController.getOneUser);
router.delete('/user/:name', userController.deleteOneUser);
router.post('/user/validate', userController.validate);


module.exports = router;


