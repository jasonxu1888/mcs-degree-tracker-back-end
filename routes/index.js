const express = require('express');
const router  = express.Router();

const userController = require('../controllers/user');
const courseController = require('../controllers/course');
const studentController = require('../controllers/student');


router.get('/user', userController.getAllUser);
router.post('/user', userController.newUser);
router.delete('/user', userController.deleteAllUser);
router.get('/user/:userid', userController.getOneUser);
router.delete('/user/:userid', userController.deleteOneUser);
router.post('/user/validate', userController.validate);

router.get('/course/prereqs/:courseid', courseController.findPrereqs);
router.get('/course/:courseid', courseController.findCourse);

router.get('/student/:studentid', studentController.findStudent);
router.post('/student/addinfo', studentController.addInfo);

module.exports = router;


