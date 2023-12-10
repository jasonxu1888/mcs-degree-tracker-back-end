const courseModel = require("../models/course.js");
const userModel = require("../models/user.js");

const getCourse = async (req, res) => {
  try {
    var courseName = req.params.id;
    var course = await courseModel.findOne({ name: courseName });
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
      message: "Something went wrong with getting one course.",
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
      message: "Something went wrong with getting all courses.",
      data: error,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    var courseName = req.params.id;
    var course = await courseModel.deleteOne({ name: courseName });
    if (course.deletedCount <= 0) {
      res.status(500).json({
        message: "No course found to be deleted.",
        data: null,
      });
    } else {
      res.status(200).json({
        message: "OK",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong when deleting one course.",
      data: error,
    });
  }
};

const createCourse = async (req, res) => {
  try {
    var newCourse = new courseModel({
      name: req.body.name,
      credit: req.body.credit,
      detail: req.body.detail,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      daysOffered: req.body.daysOffered,
    });
    await newCourse.save();
    res.status(200).json({
      message: "OK",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong when creating one course.",
      data: error,
    });
  }
};

const validateCourseSchedule = async (req, res) => {
  var fullSchedule = req.body.schedule;

  // Check time conflicts for each semester
  for (var i = 0; i < fullSchedule.length; i++) {
    if (await checkTimeConflict(fullSchedule[i]) === true) {
      res.status(409).json({
        message: "Time conflicts exist within the schedule.",
        success: false,
        data: null,
      });
      return;
    }
  }

  // Check degree requirements
  var flattenedSchedule = fullSchedule.flat(Infinity);
  if (await checkDegreeRequirements(flattenedSchedule) === true) {
    res.status(409).json({
      message: "Degree requirements are not met.",
      success: false,
      data: null,
    });
    return;
  }

  // Valid schedule, so update user
  var currentUser = req.body.id;
  res.status(201).json({
    message: "Course schedule is valid.",
    success: true,
    data: fullSchedule,
  });
};

// `true` if there is a time conflict
// `false` if there are no time conflicts
async function checkTimeConflict(semesterSchedule) {
  var scheduleDetails = [];
  for (let i = 0; i < semesterSchedule.length; i++) {
    scheduleDetails.push(await courseModel.findOne({ name: semesterSchedule[i] }));
  }
  var daysOfWeek = ["M", "T", "W", "R", "F"];
  for (let i = 0; i < daysOfWeek.length; i++) {
    var currentDay = daysOfWeek[i];
    var courseShareDay = [];
    for (let j = 0; j < scheduleDetails.length; j++) {
      if (scheduleDetails[j].daysOffered.includes(currentDay)) {
        courseShareDay.push([
          scheduleDetails[j].startTime,
          scheduleDetails[j].endTime,
        ]);
      }
    }
    courseShareDay.sort(function (a, b) {
      return a[0].localeCompare(b[0]);
    });
    for (let j = 1; j < courseShareDay.length; j++) {
      var prevClassEnd = courseShareDay[j - 1][1];
      var nextClassStart = courseShareDay[j][0];
      if (prevClassEnd >= nextClassStart) {
        return true;
      }
    }
  }
  return false;
}

// Making two dictionaries (breadth mapped to courses, and courses mapped to breadth) for validation checks
var breadthRequirementToCourse = {
  ACPC: ["CS 426", "CS 431 Embedded Systems", "CS 433 Computer System Organization", "CS 483 Applied Parallel Programming", "CS 484 Parallel Programming"],
  AI: [
    "CS 440 Artificial Intelligence",
    "CS 441 Applied Machine Learning",
    "CS 442",
    "CS 443 Reinforcement Learning",
    "CS 444 Deep Learning for Compt Visn",
    "CS 445 Computational Photography",
    "CS 446 Machine Learning",
    "CS 447",
    "CS 448 Audio Computing Laboratory",
  ],
  BCB: ["CS 466"],
  CE: [],
  DIS: ["CS 410 Text Information Systems", "CS 411 Database Systems", "CS 412 Introduction to Data Mining", "CS 470"],
  IC: [
    "CS 409",
    "CS 415 Game Development",
    "CS 416",
    "CS 417",
    "CS 418",
    "CS 419",
    "CS 445 Computational Photography",
    "CS 465 ",
    "CS 467 Social Visualization",
    "CS 469",
  ],
  PLFMSE: [
    "CS 421 Progrmg Languages & Compilers",
    "CS 422",
    "CS 427",
    "CS 428",
    "CS 474",
    "CS 475",
    "CS 476",
    "CS 477 Formal Software Devel Methods",
  ],
  SC: ["CS 450 Numerical Analysis", "CS 482 Simulation"],
  SP: ["CS 461 Computer Security I", "CS 463 Computer Security II"],
  SN: [
    "CS 414",
    "CS 423",
    "CS 424",
    "CS 425 Distributed Systems",
    "CS 434 Real World Algorithms - IoT/DS",
    "CS 435 Cloud Networking",
    "CS 436",
    "CS 437 Topics in Internet of Things",
    "CS 438 Communication Networks",
    "CS 439",
    "CS 461 Computer Security I",
    "CS 463 Computer Security II",
    "CS 498 Cloud Computing Applications",
  ],
  TA: ["CS 473 Algorithms", "CS 475"],
};

var courseToBreadthRequirement = {};
for (var breadth in breadthRequirementToCourse) {
  var courses = breadthRequirementToCourse[breadth];
  courses.forEach(function (course) {
    if (course in courseToBreadthRequirement) {
      courseToBreadthRequirement[course].push(breadth);
    } else {
      courseToBreadthRequirement[course] = [breadth];
    }
  });
}

// Assumes most common schedule plan. (no double counting 500 and 400 levels)
// 16 hours of Breadth Courses (# < CS 500 and # >= CS 400), 12 hours of Advanced Courses, and 4 hours of any additional CS Course
// 16 + 12 + 4 = 32
// Returns `true` if does not meet degree requirements
// Returns `false` if does meet degree requirements
async function checkDegreeRequirements(schedule) {
  // Check duplicate courses
  var uniqueCourses = new Set(schedule);
  if (uniqueCourses.size !== schedule.length) {
    return true;
  }

  // Check minimum hours (32), at least 8 classes
  if (uniqueCourses.size < 8) {
    return true;
  }

  // Check # >= 500 requirements
  var advancedRequirements = 3;
  for (let i = 0; i < schedule.size; i++) {
    var sep = schedule[i].split(" ");
    if (parseInt(sep[1]) >= 500) {
      advancedRequirements -= 1;
    }
  }
  if (advancedRequirements > 0) {
    return true;
  }

  // Check # < 500 requirements
  var breadthRequirements = new Set();

  var coursesThatCanFulfillTwoCategories = new Set([
    "CS 445",
    "CS 461",
    "CS 463",
    "CS 475",
  ]);
  // Process all courses that only fit within a single breadth category
  for (let i = 0; i < schedule.length; i++) {
    var course = schedule[i];
    var sep = course.split(" ");
    if (
      parseInt(sep[1]) < 500 &&
      !coursesThatCanFulfillTwoCategories.has(course)
    ) {
      if (course in courseToBreadthRequirement) {
        breadthRequirements.add(courseToBreadthRequirement[course][0]);
      }
    }
  }

  // Process all courses that fit within two breadth categories
  // If one of the categories already exists within the breadth requirements, then the current course can flex for the other category
  // e.g. `CS 445` is a two-category course and fulfills the `AI` and `IC` breadth requirements
  // After processing all the single-category courses, let's say `AI` is in the fulfilled breadth requirement (from taking CS 440 for example)
  // That means CS 445 can flex to the 'IC' category, so both `AI` and `IC` are fulfilled
  // This is why ALL single-category courses are processed, then ALL double-course categories are processed

  for (let i = 0; i < schedule.length; i++) {
    var course = schedule[i];
    var sep = course.split(" ");
    if (
      parseInt(sep[1]) < 500 &&
      coursesThatCanFulfillTwoCategories.has(course)
    ) {
      var firstCategory = courseToBreadthRequirement[course][0];
      var secondCategory = courseToBreadthRequirement[course][1];
      if (breadthRequirements.has(firstCategory)) {
        breadthRequirements.add(secondCategory);
      } else if (breadth.has(secondCategory)) {
        breadthRequirements.add(firstCategory);
      } else {
        breadthRequirements.add(firstCategory);
      }
    }
  }

  if (breadth.size < 4) {
    return true;
  }

  return false;
}

const deleteAllCourses = async (req, res) => {
  try {
    _ = await courseModel.deleteMany();
    res.status(200).json({
      message: "OK",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong when deleting all courses.",
      data: error,
    });
  }
};

const updateCourseName = async (req, res) => {
  try {
    var courseName = req.params.id;
    var changedName = req.body.name;
    var course = await courseModel.findOneAndUpdate(
      { name: courseName },
      { $set: { name: changedName } }
    );
    if (course === null) {
      res.status(404).json({
        message: "No course found to be updated.",
        data: null,
      });
    } else {
      res.status(200).json({
        message: "OK",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong updating a course name.",
      data: error,
    });
  }
};

//export controller functions
module.exports = {
  getCourse,
  getAllCourses,
  validateCourseSchedule,
  createCourse,
  deleteCourse,
  deleteAllCourses,
  updateCourseName,
};
