const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
    {
        firstName: {
            type:String,
            required:true,
         
            maxLenght:50,

        },
        lastName: {
            type:String,
          
            maxLenght:50,
        },
        email: {
            type:String,
            required:true,
            unique: true,
            lowercase:true,
            trim:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("email is not a valid one!");
                }
            }
        },
        gender: {
            type:String,
            enum:{
                values:["female","male","others","Female","Male"],
                message:'{VALUE} is not supported'
            }
           
        },
        age: {
            type:Number,
            min:18,
        },
        password: {
            type:String,
            required:true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a Strong Password!");
                }
            }

        },
        userPhoto:{
            type:String,
            default:"https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
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

userSchema.methods.createToken = async function(){
   const user = this;
   const token = await jwt.sign({_id:user._id},"DevTinder@123");
   
    return token;
};

userSchema.methods.validatePassword = async function(userEnteredPassword){
    const user = this;
    const validation = await bcrypt.compare(userEnteredPassword, user.password);
    return validation;
}

const User = mongoose.model("user",userSchema);
module.exports = User;