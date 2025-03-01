const socket = require("socket.io");

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
            "sendMessage",({
            firstName,
            userId,
            targetUserId,
            text
          })=>{
            const room = [userId, targetUserId].sort().join("_");
            // console.log(firstName+ " " + text);s
            io.to(room).emit("messageReceived", {firstName,text});
        });

        socket.on("disconnect",()=>{

        });
    });
};

module.exports = initialise;