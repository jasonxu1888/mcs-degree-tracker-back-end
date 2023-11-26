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

const addInfo = async (req, res, next) => {
    var id = req.body.id;
    var enrolledCourses;
    console.log("Adding info for student:" + id );
    try {
        updStudent = await student.findOne({id:id});
        // update enrolled courses.
        if((enrolledCourses = req.body.enrolledCourses) != null){
            console.log("Enrolled Courses needs added:" + enrolledCourses);
            updStudent.enrolledCourses.push(enrolledCourses);
            updStudent.save();
        }
        // repeat for other categories.

        res.status(200).json({message:"OK",data:updStudent});

    } catch (error) {
        console.log(error);
        res.status(404).json({message:"Student info for " + id + " cannot be updated"});
    }

}

//export controller functions
module.exports = {
    findStudent,
    addInfo
};