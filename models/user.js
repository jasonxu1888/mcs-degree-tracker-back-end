// Load required packages
var mongoose = require('mongoose');

// Define our user schema
// no password encryption for now.
var UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    id: String,
    role: String,
    email: String,
    dateCreated: Date,
    status: String,
    password: String
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
