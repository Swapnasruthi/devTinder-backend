const express = require("express");
const profileAuth = express.Router();
const cookieParser = require("cookie-parser");
const {UserAuth} = require("../middlewares/auth");
const {validatingProfileEdits} = require("../utils/validation");
const bcrypt = require("bcrypt");

profileAuth.use(cookieParser());  //--> to read cookies from the request.
profileAuth.use(express.json());  //--> to read json data from the Db.

profileAuth.get("/profile",UserAuth, async (req,res)=>{
    try{
        const {token} = req.cookies;
     
       
        res.send(req.User);
    }
    catch(err){
        res.status(500).send("Error:"+err.message);
    }
});

profileAuth.patch("/profile/edit", UserAuth, async (req,res)=>{
    try{
        if(!validatingProfileEdits(req)){
            throw new Error("Invalid Edit Request!");
        }

        const loggedUser = req.User;
        Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
        

        const data = await loggedUser.save();
        res.send(data);
  
    }
    catch(err){
        res.status(500).send("Error:"+err.message);
    }
});

profileAuth.patch("/profile/password", UserAuth, async (req,res)=>{
    try{
        const loggedUser = req.User;
        const isPasswordTrue = await bcrypt.compare(req.body.password, loggedUser.password);
        if(!isPasswordTrue){
            throw new Error("your current password is incorrect!");
        }
        const newHashPassword = await bcrypt.hash(req.body.newPassword, 10);
        loggedUser.password = newHashPassword;
        await loggedUser.save();
        res.send("successfully changed password!");
    }
    catch(err){
        res.status(500).send("error:"+err.message);
    }
  
});

module.exports = profileAuth;