const course = require("../models/course.js");

//get '/course/:courseid'
const getCourse = async (req, res, next) => {};

const getAllCourses = async (req, res, next) => {};

const validateCourseSchedule = async (req, res, next) => {};

//export controller functions
module.exports = {
  getCourse,
  getAllCourses,
  validateCourseSchedule,
};
