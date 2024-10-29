const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstName: {
            type:String,
        },
        lastName: {
            type:String,
        },
        email: {
            type:String,
        },
        gender: {
            type:String,
        },
        age: {
            type:Number,
        },
        password: {
            type:String,
        }
    }
);

const User = mongoose.model("user",userSchema);
module.exports = User;