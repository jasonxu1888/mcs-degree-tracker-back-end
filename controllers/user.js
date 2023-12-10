const User = require("../models/user.js");

//GET '/user'
const getAllUser = async (req, res, next) => {
    out = await User.find();
    console.log("inside get all users" + out);
    res.status(200).json({message:"OK",data:out});
};

//POST '/user'
const createNewUser = (req, res, next) => {
    valid = true
    userJson = req.body
    if(!valid){
        res.statusCode = 400;
        res.json({
            "success": false,
            "message": userJson,
            "data": ""
        })
    }
    else{
        User.findOne({"email":userJson.email}).then( (userSameEmail)=> 
        {
            if (userSameEmail != null) 
            {
                res.statusCode = 400;
                res.json({ 
                    "success": false,
                    "message": "User Not Created - Email Already Linked to another User",
                    "data": ""})
            }
            else
            {
                record = new User(userJson)
                record.save()
                .then( (savedRec) => {
                    res.statusCode = 201;
                    res.json({ 
                        "success": true,
                        "message": "User Created",
                        "data": savedRec})
                    })
            }
        })
    }    
};

//DELETE '/user'
const deleteAllUser = async (req, res, next) => {
    out = await User.deleteMany();
    console.log("inside delete all users");
    res.status(200).json({message:"OK",data:""});
};

//GET '/user/:userid'
// /user/123 will have req.params.id = 123
const getOneUser = async (req, res, next) => {
    var id = req.params.id;
    try {
        console.log(id);
        out = await User.findById(id);
        res.status(200).json({message:"OK",data:out});
    } catch (error) {
        res.status(404).json({message:"USER NOT FOUND"});
    }
};

const updateUser = async (req, res, next) => {
    valid = true
    userJson = req.body
    id = req.params.id
    if(!valid){
        res.statusCode = 400;
        res.json({
            "message": userJson,
            "data": ""
        })
    }
    else{
        if(id == null){
            res.statusCode = 400;
            res.json({
                "message": "User Not Updated - no id given",
                "data": ""
            })
        }

        User.findById(id).then( (userObj)=> 
        {
            if (userObj == null) 
            {
                res.statusCode = 400;
                res.json({ 
                    "message": "User Not Updated - No User Found for that ID",
                    "data": ""})
            }
            else
            {
                User.findByIdAndUpdate(id, userJson, {new: true})
                .then( (updatedRec) => {
                    if(updatedRec == null){
                        res.statusCode = 404;
                        res.json({ 
                            "message": "User Not Updated - User Not Found",
                            "data": ""})
                    }
                    else{
                        res.statusCode = 200;
                        res.json({ 
                            "message": "User Updated",
                            "data": updatedRec})
                    }
                })
            }
        })
    }
    
}
//get the id and password. Validate if password is correct.
const validate = async (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    console.log("Email:" + email);
    var validUser = false;
    try {
        out = await User.findOne({email:email});
        if(out.password == password){
            validUser = true;
        } 
        console.log(out);
    } catch (error){
        console.log(error);
    }
    console.log("id:" + email + ", password" + "not a good practice to print...");
    if(validUser){
        res.status(200).json({message: "User gave a valid password", data: out, success: true});
    } else {
        res.status(404).json({message: "Invalid Password", data: null, success: false});
    }
};

//DELETE '/user/:name'
const deleteOneUser = async (req, res, next) => {
    var id = req.params.id;
    try {
        out = await User.deleteOne({_id:id});
        print(out)
        res.status(200).json({message:"OK",data:out});
    } catch (error) {
        res.status(404).json({message:"USER NOT FOUND", data: null});
    }
};

//export controller functions
module.exports = {
    getAllUser, 
    deleteAllUser,
    createNewUser,

    getOneUser,
    updateUser,
    validate,
    deleteOneUser
};