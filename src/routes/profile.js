const express = require("express");
const profileAuth = express.Router();
const cookieParser = require("cookie-parser");
const {UserAuth} = require("../middlewares/auth");


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

module.exports = profileAuth;