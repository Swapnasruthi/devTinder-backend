const express = require("express");
const requestAuth = express.Router();
const User = require("../models/user");
const cookieParser = require("cookie-parser");


requestAuth.use(cookieParser());  //--> to read cookies from the request.
requestAuth.use(express.json());  //--> to read json data from the Db.

requestAuth.patch("/user/:userid",async (req,res)=>{
    const userId = req.params?.userid;
    const data = req.body;
    try{
        
        const  ALLOWED_UPDATES = [
            "password",
            "gender",
            "age",
            "userphoto",
            "about",
            "skills"

        ];
       const isUpdatesAllowed = Object.keys(data).every((k)=> 
        ALLOWED_UPDATES.includes(k)
       );
        if(!isUpdatesAllowed){
            throw new Error("update is not allowed!");  
        }
        const user = await User.findByIdAndUpdate({_id: userId}, data,{
            runValidators:true,
        });
        res.send("user updated successfully!");
    }
    catch(err){
        res.status(500).send("update failed!"+ err.message);
    }
    
});

module.exports = requestAuth;