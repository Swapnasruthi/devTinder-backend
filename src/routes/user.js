const express = require("express");
const userAuth = express.Router();
const {UserAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionSchema");

userAuth.get("/user/requests", UserAuth, async (req,res)=>{
    try{
        const loggedUser = req.User;
        if(!loggedUser){
            throw new Error("Please LogIn");
        }
        const requests = await ConnectionRequest.find({
            toUserId:loggedUser._id,
            status:"interested"
        }).populate("fromUserId", "firstName lastName");
    
        res.json({
            message:"connections fetched!",
            requests
        });
    }
    catch(err){
        res.status(400).send("Error:"+err.message);
    }
   
})
module.exports = userAuth;