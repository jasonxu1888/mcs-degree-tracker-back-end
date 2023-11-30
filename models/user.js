// Load required packages
var mongoose = require('mongoose');

// Define our user schema
// no password encryption for now.
var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    dateCreated: Date,
    password: String,
    programYear: Number,
    program: String,
    plannedCourses: Array
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
