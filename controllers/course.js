const courseModel = require("../models/course.js");
const userModel = require("../models/user.js");

const getCourse = async (req, res) => {
  try {
    var CRN = req.params.id;
    console.log(CRN);
    var course = await courseModel.findOne({ id: CRN });
    if (course === null) {
      res.status(404).json({
        message: "Not Found",
        data: course,
      });
    } else {
      res.status(200).json({
        message: "OK",
        data: course,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      data: error,
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    var courses = await courseModel.find();
    res.status(200).json({
      message: "OK",
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      data: error,
    });
  }
};

const validateCourseSchedule = async (req, res) => {};

//export controller functions
module.exports = {
  getCourse,
  getAllCourses,
  validateCourseSchedule,
};
