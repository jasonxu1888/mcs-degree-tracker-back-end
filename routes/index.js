const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const courseController = require("../controllers/course");

// User Routes
router.get("/users", userController.getAllUser);
router.delete("/users/:id", userController.deleteOneUser);
router.delete("/users", userController.deleteAllUser);
router.post("/users", userController.createNewUser);
router.put("/users/:id", userController.updateUser);
router.get("/users/:id", userController.getOneUser);
router.post("/users/validate", userController.validate);

// Course Routes
router.get("/courses/:id", courseController.getCourse);
router.get("/courses", courseController.getAllCourses);
router.post("/validate", courseController.validateCourseSchedule);
router.post("/courses", courseController.createCourse);
router.delete("/courses/:id", courseController.deleteCourse);
router.delete("/delete/courses/all", courseController.deleteAllCourses);
router.put("/courses/:id", courseController.updateCourseName);

module.exports = router;
