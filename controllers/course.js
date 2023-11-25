const course = require("../models/course.js");


//get '/course/:courseid'
const findCourse = async (req, res, next) => {
    console.log("hello get one course");    
    var id = req.params.courseid;
    try {
        out = await course.find({id:id});
        res.status(200).json({message:"OK",data:out});
    } catch (error) {
        res.status(404).json({message:"USER NOT FOUND"});
    }
};


/*
    get endpoint '/course/preqs/:courseid'
    returns all prequsite courses as an array of course ids.
*/
const findPrereqs = async (req, res, next) => {
    var courseId = req.params.courseid;
    tmp = await course.findOne({id:courseId});
    tmp.prereqs.forEach(recursePrereq);
    res.status(200).json({message:"OK",data:allprereqs});
};

var allprereqs = [];

/**
 * recursive method to iterate all prerequisites. Able to print but allprereqs seems to reset.
 * FIXME
 */
findPrereqsForCourse = async (courseId)  => {
    out = await course.findOne({id:courseId});
    let i = 0;
    while( out != null && out.prereqs != null) {
        allprereqs.push(out.prereqs);
        out = await findPrereqsForCourse(out.prereqs[i]);
        allprereqs.push(out.prereqs);
        i++;
    }
    console.log("Pre reqs:" + allprereqs);
    return allprereqs;
};




function recursePrereq(course){
    allprereqs.push(course);
    findPrereqsForCourse(course);
}


//export controller functions
module.exports = {
    findCourse,
    findPrereqs
};