const express = require("express");
const requestAuth = express.Router();
const User = require("../models/user");
const cookieParser = require("cookie-parser");
const ConnectionRequest = require("../models/connectionSchema");
const {UserAuth} = require("../middlewares/auth");
requestAuth.use(cookieParser());  //--> to read cookies from the request.
requestAuth.use(express.json());  //--> to read json data from the Db.

requestAuth.post("/request/send/:status/:toUserId", UserAuth, async (req,res)=>{
    try{
        const fromUserId = req.User._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
    
        const allowedStatus = [
            "interested",
            "ignored"
        ];
        if(!allowedStatus.includes(status)){
            throw new Error("invalid status!");
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            throw new Error("User is not found!");
        }

        const reduntantConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId , toUserId},
                {fromUserId : toUserId, toUserId: fromUserId},
            ]
        });
        if(reduntantConnectionRequest){
            throw new Error("connection already exists!");
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });
    
        const sender = await User.findById(fromUserId);
        const receiver = await User.findById(toUserId);

        const data = await connectionRequest.save();
        res.json({
            message:sender.firstName +" "+ status + " "+ receiver.firstName,
            data,
        });
    }
    catch(err){
        res.status(400).send("Error:"+err.message)
    }
    
});


module.exports = requestAuth;