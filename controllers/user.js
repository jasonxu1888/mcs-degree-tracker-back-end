const user = require("../models/user.js");

//GET '/user'
const getAllUser = async (req, res, next) => {
    out = await user.find();
    console.log("inside get all users" + out);

    res.status(200).json({message:"OK",data:out});
};

//POST '/user'
const newUser = (req, res, next) => {

    if(!(req.body.email && req.body.name)){
        res.statusCode = 400;
        res.json({ 
            "message": "User Not Created - Email and Name are required for User Creation",
            "data": ""})
        return
    }

    // try{
    //     userJson = 
    // }


    // try {
        
    
    //     await User.findOne({"email":req.body.email}).then( (userSameEmail)=> 
    //     {
    //         if (userSameEmail != null) 
    //         {
    //             res.statusCode = 400;
    //             res.json({ 
    //                 "message": "User Not Created - Email Already Linked to another User",
    //                 "data": ""})
    //         }
    //         else
    //         {
    //             var newUser = 
    //             {
    //             "name":req.body.name,
    //             "email":req.body.email
    //             }
    //             if(req.body.pendingTasks){
    //                 newUser.pendingTasks = req.body.pendingTasks
    //             }
                
    //             record = new User(newUser)
    //             record.save()
    //             .then( (savedRec) => {
    //                 res.statusCode = 201;
    //                 if(savedRec.pendingTasks.length > 0){
    //                     updateTaskUser(savedRec.pendingTasks, {"assignedUser": savedRec._id, "assignedUserName":savedRec.name})

    //                 }
    //                 res.json({ 
    //                     "message": "User Created",
    //                     "data": savedRec})
    //                 }))
    
    //         }
    //     }))
    // } catch (error) {
    //     res.statusCode = 500;
    //     res.json({ 
    //         "message": "User Not Created - Server Error",
    //         "data": ""})
    // }
    
};

//DELETE '/user'
const deleteAllUser = (req, res, next) => {
    res.json({message: "DELETE all user"});
};

//GET '/user/:userid'
// /user/123 will have req.params.id = 123
const getOneUser = async (req, res, next) => {
    var id = req.params.userid;
    try {
        out = await user.find({id:id});
        res.status(200).json({message:"OK",data:out});
    } catch (error) {
        res.status(404).json({message:"USER NOT FOUND"});
    }
};

//POST '/user/validate'
//get the id and password. Validate if password is correct.
const validate = async (req, res, next) => {
    var id = req.body.id;
    var password = req.body.password;
    console.log("id:" + id);
    var validUser = false;
    try {
        out = await user.findOne({id:id});
        if(out.password == password){
            validUser = true;
        } 
        console.log(out);
    } catch (error){
        console.log(error);
    }
    console.log("id:" + id + ", password" + "not a good practice to print...");
    if(validUser){
        res.json({message: "User gave a valid password"});
    } else {
        res.json({message: "Invalid Password"});
    }
};

//DELETE '/user/:name'
const deleteOneUser = (req, res, next) => {
    res.json({message: "DELETE 1 user"});
};

//export controller functions
module.exports = {
    getAllUser, 
    newUser,
    deleteAllUser,
    getOneUser,
    validate,
    deleteOneUser
};