const express = require("express");
const { Chat } = require("../models/chat");
const { UserAuth } = require("../middlewares/auth"); // Ensure correct import

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", UserAuth, async(req, res) => {
    const {targetUserId} = req.params;
    const userId = req.User._id;
    try{
        let chat =await Chat.findOne({
            participants: {$all: [userId, targetUserId]},
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
        });
        
        if(!chat){
            chat = new Chat({
                participants:[userId, targetUserId],
                messages:[],
            });
            await chat.save();
        }
        res.json(chat);
    }
    catch(err){
        console.log("error at chatRouter "+ err);
        res.status(500).json({ error: "Internal server error" }); // Added error response
    }
})

module.exports = chatRouter;