const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstName: {
            type:String,
            required:true,
        },
        lastName: {
            type:String,
        },
        email: {
            type:String,
            required:true,
            unique: true,
            lowercase:true,
            trim:true,
        },
        gender: {
            type:String,
            validate(value){
                if(!["female","male","others"].includes(value)){
                    throw new Error("Gender data is not valid!");
                }
            }
        },
        age: {
            type:Number,
            min:18,
        },
        password: {
            type:String,
        },
        userPhoto:{
            type:String,
        },
        about:{
            type:String,
            default:"This is a default about",
        },
        skills:{
            type:[String],
        }

    },
    {
        timestamps:true,
    }
);

const User = mongoose.model("user",userSchema);
module.exports = User;