const student = require("../models/student.js");


//get '/student/:studentid'
const findStudent = async (req, res, next) => {
    console.log("hello get one course");    
    var id = req.params.studentid;
    try {
        out = await student.findOne({id:id});
        res.status(200).json({message:"OK",data:out});
    } catch (error) {
        res.status(404).json({message:"USER NOT FOUND"});
    }
};

//export controller functions
module.exports = {
    findStudent
};