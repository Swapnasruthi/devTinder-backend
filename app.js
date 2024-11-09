const express = require("express");
const app = express();
const connectDb = require("./src/config/databases");
const User = require("./src/models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(cookieParser());  //--> to read cookies from the request.
app.use(express.json());  //--> to read json data from the Db.



const profileAuth = require("./src/routes/profile");
const authRouter = require("./src/routes/auth");
const requestAuth = require("./src/routes/request");


app.use("/",profileAuth);
app.use("/",requestAuth);
app.use("/",profileAuth);


//for fetching only a single user using the particular email.
app.get("/user",async (req,res)=>{
    try{
    const user =await User.find({email:req.body.email});
    if(user.length === 0){
        res.send("user not found!");

    }else{
        res.send(user);

    }
    }
    catch(err){
        res.status(500).send("Error:"+err.message);
    }

});

//FEED Api - fetching all the users from the databse.
app.get("/feed",async(req,res)=>{
    try
    {
    const users = await User.find({});
    res.send(users);
}
    catch(err){
        res.status(500).send("something went wrong!");
    }
});


//Api to delete an user.
app.delete("/user",async (req,res)=>{
    try{
        const user = await User.findByIdAndDelete({_id:req.body.userid});
        res.send("user deleted successfully!");
    }
    catch(err){
        res.status(500).send("something went wrong!");
    }
});

//api to update a user.



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
        console.error("Database cannot be connected"+err.name);
    }
)


