const express = require("express");
const userAuth = express.Router();
const {UserAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionSchema");
const User = require("../models/user.js");
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
   
});

userAuth.get("/user/connections", UserAuth, async(req,res)=>{
    try{
        const loggedUser = req.User;

        const connections = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedUser._id, status:"accepted"},
                {fromUserId:loggedUser._id, status:"accepted"}
            ]
        }).populate("fromUserId","firstName lastName")
            .populate("toUserId","firstName lastName");
    
        const data = connections.map((row) => {
            if(row.fromUserId._id.toString() == loggedUser._id.toString()){
                return row.toUserId;
            }
            else{
                return row.fromUserId;
            }
        });
        res.json({data});
    }
    catch(err){
        res.status(400).send("Error:"+err.message);
    }
});

userAuth.get("/feed", UserAuth, async(req,res)=>{
    try{
        const loggedUser = req.User;
        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedUser._id},
                {toUserId:loggedUser._id}
            ]
        }).select("fromUserId toUserId");

        const ignoredConnections = new Set();
        connections.forEach((req)=>{
            ignoredConnections.add(req.fromUserId.toString());
            ignoredConnections.add(req.toUserId.toString());
        });
        console.log(ignoredConnections);
        const usersFeed = await User.find({
            // $and:[
            //     {_id: {$nin: Array.from(ignoredConnections)}},
            //     {_id :{$ne: loggedUser._id}}
            // ]
            _id: {$nin: Array.from(ignoredConnections)}
        }).select("firstName lastName gender");
        res.send(usersFeed);
    }
    catch(err){
        res.status(400).send("Error:"+err.message);
    }

});
module.exports = userAuth;