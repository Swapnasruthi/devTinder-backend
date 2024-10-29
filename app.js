const express = require("express");
const app = express();
const connectDb = require("./src/config/databases");
const User = require("./src/models/user");
app.post("/signup",async (req,res)=>{
    const userdata = {
        firstName:"virat",
        lastName:"kohli",
        email:"swapnasruthi2005gmail.com",
        gender:"female"
    }
    const user = new User(userdata);
    await user.save();
    res.send("user is signed up successfully!");
})
connectDb()
.then(
    ()=>{
        console.log("connected successfully!");
        app.listen(3000,()=>{
            console.log("server connected at 3000 successfully!");
        });
    }
       
)
.catch(
    (err)=>{
        console.error("Database cannot be connected");
    }
)



