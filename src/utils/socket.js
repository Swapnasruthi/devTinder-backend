const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initialise = (server)=>{
    const io = socket(server, {
        cors:{
            origin:"http://localhost:5173",
        }
    });
    
    io.on("connection", (socket)=>{ // Changed "connections" to "connection"
        //handling events  
             

        socket.on("joinChat",({firstName, userId, targetUserId})=>{
            const roomId = [userId, targetUserId].sort().join("_");
            socket.join(roomId);
        });

        socket.on(
            "sendMessage",async ({
            firstName,
            userId,
            targetUserId,
            text
          })=>{

            //saving the messages to database
            try{
                const room = [userId, targetUserId].sort().join("_");
                 //console.log(firstName+ " " + text);
                let chat = await Chat.findOne({
                    participants: {$all: [userId, targetUserId]},
                });

                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages:[],
                    });
                }
                chat.messages.push(
                    {
                        senderId: userId,
                        text,
                    }
                )
                await chat.save();
                io.to(room).emit("messageReceived", {firstName,text});
        
            }catch(err){
                console.log("error at saving the messages at db "+err);
            }
        });


        socket.on("disconnect",()=>{

        });
    });
};

module.exports = initialise;