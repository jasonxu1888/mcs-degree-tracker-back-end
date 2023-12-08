// Load required packages
var mongoose = require("mongoose");

// Define our course schema
// no password encryption for now.
var CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  credit: { type: String, required: true },
  detail: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  daysOffered: { type: [String], required: true },
});

// Export the Mongoose model
module.exports = mongoose.model("Course", CourseSchema);
