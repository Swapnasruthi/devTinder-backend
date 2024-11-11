const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        status:{
            type:String,
            enum:{
                values:["interested","ignored","accepted","rejected"],
                message:'{VALUE} is an invalid status',
                required:true
            }
        }
    },
    {
        timestamps:true
    }
);

connectionRequestSchema.pre("save", function()
{
    const connectionRequest = this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("you can not send connection request to yourself!");
    }
})
const ConnectionRequestModal = new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports = new mongoose.model("ConnectionRequest",connectionRequestSchema);