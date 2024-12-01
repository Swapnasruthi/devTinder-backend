const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const cookieParser = require("cookie-parser");
 
authRouter.use(cookieParser());  //--> to read cookies from the request.
authRouter.use(express.json());  //--> to read json data from the Db.

authRouter.post("/signup",async (req,res)=>{
    try{
        //validating the data
            //validation is done at the schema level of the modal itself. hence helper func is not created.
        const {firstName, lastName, email, password} = req.body;

        //encrypting the password.
            //generating a hash password using bcrypt.
        

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,lastName, email, password: passwordHash
        });
       
        await user.save();
        const token = await user.createToken();

        res.cookie("token",token);
        res.send(user);
    }
    catch(err){
        res.status(400).send("error saving the user"+err.message);
    }
});


authRouter.post("/login", async (req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("User not found!");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            //creating jwt token 

            const token = await user.createToken();

            res.cookie("token",token);
            res.send(user);
    
        }
        else{
            throw new Error("Invalid Credentails!");
        }
    }
    catch(err){
        res.status(400).send(err.message);
    }

});

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",{},{
        expires: new Date(Date.now()),
   });
    res.send("logout successfully!");
}); 

module.exports = authRouter;