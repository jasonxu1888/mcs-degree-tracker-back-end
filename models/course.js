// Load required packages
var mongoose = require('mongoose');

// Define our course schema
// no password encryption for now.
var CourseSchema = new mongoose.Schema({
    id: String,
    name: String,
    credit: {type:Number, min:1, max:5},
    detail: String,
    offeredTerms: Array
});

// Export the Mongoose model
module.exports = mongoose.model('Course', CourseSchema);
