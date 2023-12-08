const course = require("../models/course.js");
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

const validateCourseSchedule = async (req, res) => {
  var fullSchedule = JSON.parse(req.body.schedule);

  // Check time conflicts for each semester
  for (var i = 0; i < fullSchedule.length; i++) {
    if (checkTimeConflict(fullSchedule[i])) {
      res.status(409).json({
        message: "Time conflicts exist within the schedule.",
        data: null,
      });
      return;
    }
  }

  // Check degree requirements
  var flattenedSchedule = fullSchedule.flat(Infinity);
  if (checkDegreeRequirements(flattenedSchedule)) {
    res.status(409).json({
      message: "Degree requirements are not met.",
      data: null,
    });
    return;
  }

  // Valid schedule, so update user
  // (TODO HERE)
  res.status(201).json({
    message: "Course schedule is valid.",
    data: fullSchedule,
  });
};

// `true` if there is a time conflict
// `false` if there are no time conflicts
async function checkTimeConflict(semesterSchedule) {
  var scheduleDetails = [];
  for (let i = 0; i < semesterSchedule.length; i++) {
    scheduleDetails.push(await courseModel.find({ id: semesterSchedule[i] }));
  }
  var daysOfWeek = ["M", "T", "W", "R", "F"];
  for (let i = 0; i < daysOfWeek.length; i++) {
    var currentDay = daysOfWeek[i];
    var courseShareDay = [];
    for (let j = 0; j < scheduleDetails.length; j++) {
      if (scheduleDetails[i].daysOffered.includes(currentDay)) {
        courseShareDay.push([
          scheduleDetails[i].startTime,
          scheduleDetails[i].endTime,
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
  ACPC: ["CS 426", "CS 431", "CS 433", "CS 483", "CS 484"],
  AI: [
    "CS 440",
    "CS 441",
    "CS 442",
    "CS 443",
    "CS 444",
    "CS 445",
    "CS 446",
    "CS 447",
    "CS 448",
  ],
  BCB: ["CS 466"],
  CE: [],
  DIS: ["CS 410", "CS 411", "CS 412", "CS 470"],
  IC: [
    "CS 409",
    "CS 415",
    "CS 416",
    "CS 417",
    "CS 418",
    "CS 419",
    "CS 445",
    "CS 465",
    "CS 467",
    "CS 469",
  ],
  PLFMSE: [
    "CS 421",
    "CS 422",
    "CS 427",
    "CS 428",
    "CS 474",
    "CS 475",
    "CS 476",
    "CS 477",
  ],
  SC: ["CS 450", "CS 482"],
  SP: ["CS 461", "CS 463"],
  SN: [
    "CS 414",
    "CS 423",
    "CS 424",
    "CS 425",
    "CS 434",
    "CS 435",
    "CS 436",
    "CS 437",
    "CS 438",
    "CS 439",
    "CS 461",
    "CS 463",
    "CS 498 Cloud Computing Applications",
  ],
  TA: ["CS 473", "CS 475"],
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
      breadthRequirements.add(courseToBreadthRequirement[course][0]);
    }
  }

  // Process all courses that fit within two breadth categories
  // If one of the categories already exists within the breadth requirements, then the current course can flex for the other category
  // e.g. `CS 445` is a two-category course and fulfills the `AI` and `IC` breadth requirements
  // After processing all the single-course categories, let's say `AI` is in the fulfilled breadth requirement (from taking CS 440 for example)
  // That means CS 445 can flex to the 'IC' category, so both `AI` and `IC` are fulfilled
  // This is why ALL single-course categories are processed, then ALL double-course categories are processed

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

//export controller functions
module.exports = {
  getCourse,
  getAllCourses,
  validateCourseSchedule,
};
