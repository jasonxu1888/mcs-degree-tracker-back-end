const user = require("../models/user.js");

//GET '/user'
const getAllUser = async (req, res, next) => {
    out = await user.find();
    console.log("inside get all users" + out);
    res.status(200).json({message:"OK",data:out});
};

function validateInputNewUser(input, err_message) {
    try{
        jsonbody = JSON.parse(input)
        if(!(jsonbody.email && jsonbody.name)){
            return [false, err_message + " - Email and Name are required for User Creation"]
        }
        return [true, jsonbody]
    }
    catch(err){
        return [false, err_message + " - Invalid JSON"]
    }
}

//POST '/user'
const createNewUser = (req, res, next) => {
    [valid, userJson] = validateInputNewUser(req.body, "User Not Created")
    if(!valid){
        res.statusCode = 400;
        res.json({
            "message": userJson,
            "data": ""
        })
    }
    else{
        user.findOne({"email":userJson.email}).then( (userSameEmail)=> 
        {
            if (userSameEmail != null) 
            {
                res.statusCode = 400;
                res.json({ 
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
                        "message": "User Created",
                        "data": savedRec})
                    })
            }
        })
    }    
};

//DELETE '/user'
const deleteAllUser = async (req, res, next) => {
    out = await user.deleteMany();
    console.log("inside delete all users");
    res.status(200).json({message:"OK",data:""});
};

//GET '/user/:userid'
// /user/123 will have req.params.id = 123
const getOneUser = async (req, res, next) => {
    var id = req.params.id;
    try {
        console.log(id);
        out = await user.findById(id);
        res.status(200).json({message:"OK",data:out});
    } catch (error) {
        res.status(404).json({message:"USER NOT FOUND"});
    }
};

const updateUser = async (req, res, next) => {
    [valid, userJson] = validateInputNewUser(req.body, "User Not Updated")
    id = req.params.userid
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

        user.findById(id).then( (userObj)=> 
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
                user.findByIdAndUpdate(id, userJson, {new: true})
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
const deleteOneUser = async (req, res, next) => {
    var id = req.params.id;
    try {
        out = await user.deleteOne({_id:id});
        print(out)
        res.status(200).json({message:"OK",data:out});
    } catch (error) {
        res.status(404).json({message:"USER NOT FOUND"});
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