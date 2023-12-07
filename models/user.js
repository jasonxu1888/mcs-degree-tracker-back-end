// Load required packages
var mongoose = require('mongoose');

// Define our user schema
// no password encryption for now.
var UserSchema = new mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: { type: String, unique: true, required: true },
    dateCreated: { type: Date, default: Date.now },
    password: { type: String, required: true },
    programYear: { type: Number, required:true },
    program: { type: String, default: "MCS" },
    plannedCourses: { type: Array, default: []},
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
