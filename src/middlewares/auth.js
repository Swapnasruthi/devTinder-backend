const jwt = require("jsonwebtoken");
const User = require("../models/user");
const UserAuth = async (req,res,next)=>{
                      //read the token
                      try{
                        const {token} = req.cookies;
                        console.log(token);
                      //verify the token
                        if(!token){
                          throw new error("token not valid!");
                        }
                      //decoding the token to get the id
                        const decodedId = await jwt.verify(token, "DevTinder@123");
                      //extracting the id from the decoded text
                        const {_id} = decodedId;

                        const user = await User.findById(_id);
                      //verifying the user.
                        if(!user){
                          throw new error("user not found!");
                        }
                     //sending the user directly to the next function
                        req.User = user;
                     //calling the next function to execute as it is a middle ware.
                        next();
                      }
                      catch(err){
                        res.status(500).send("error found:"+err.message);
                      }
                     
                    }



module.exports = {
    UserAuth,
}