// Load required packages
var mongoose = require('mongoose');

// Define our Student schema
// TODO completedCourses Array will be Array of Courses with students results.
var StudentSchema = new mongoose.Schema({
    id: String,
    programYear: Number,
    program: String,
    status: String,
    completedCourses: Array,
    currentCourses: Array,
    enrolledCourses: Array
});

// Export the Mongoose model
module.exports = mongoose.model('Student', StudentSchema);
