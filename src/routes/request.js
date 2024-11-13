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

requestAuth.post("/request/review/:status/:requestId", UserAuth, async (req,res)=>{
    try{
        const requestId= req.params.requestId;
        const loggedUser = req.User;
        const status = req.params.status;
    
        //valid status
        const AllowedStatus = ["accepted","rejected"];
        
        if(!AllowedStatus.includes(status)){
            throw new Error("Invalid Status!");
        }

        //valid requestId(whether it belongs to any connection request or not).
        //checking whether the toUser of the requestId if loggedUser or not. coz, only the logged user can modify   her/his requests.
        //we have the choice to accept or reject if the request is interested in you. 

        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            status:"interested",
            toUserId : loggedUser._id
        });
        if(!connectionRequest){
            throw new Error("Connection not found!");
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message:"connection is: "+status,
            data
        });
    }
   catch(err){
    res.status(400).send("Error:"+err.message);
   }
})
module.exports = requestAuth;