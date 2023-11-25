// Load required packages
var mongoose = require('mongoose');

// Define our course schema
// no password encryption for now.
var CourseSchema = new mongoose.Schema({
    id: String,
    name: String,
    category: String,
    credit: {type:Number, min:1, max:5},
    prereqs: Array,
    offeredTerms: Array
});

// Export the Mongoose model
module.exports = mongoose.model('Course', CourseSchema);
