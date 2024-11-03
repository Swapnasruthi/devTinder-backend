const express = require("express");
const app = express();
const connectDb = require("./src/config/databases");
const User = require("./src/models/user");

app.use(express.json());

//for adding the new users into the database
app.post("/signup",async (req,res)=>{

    const user = new User(req.body);
    try{
        await user.save();
        res.send("user added successfully!")
    }
    catch(err){
        res.status(400).send("error saving the user"+err.message);
    }
});

//for fetching only a single user using the particular email.
app.get("/user",async (req,res)=>{
    try{
    const user =await User.find();
    if(user.length === 0){
        res.send("user not found!");

    }else{
        res.send(user);

    }
    }
    catch(err){
        res.status(500).send("something went wrong!");
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
app.patch("/user/:userid",async (req,res)=>{
    const userId = req.params?.userid;
    const data = req.body;
    try{
        
        const  ALLOWED_UPDATES = [
            "password",
            "gender",
            "age",
            "userphoto",
            "about",
            "skills"

        ];
       const isUpdatesAllowed = Object.keys(data).every((k)=> 
        ALLOWED_UPDATES.includes(k)
       );
        if(!isUpdatesAllowed){
            throw new Error("update is not allowed!");  
        }
        const user = await User.findByIdAndUpdate({_id: userId}, data,{
            runValidators:true,
        });
        res.send("user updated successfully!");
    }
    catch(err){
        res.status(500).send("update failed!"+ err.message);
    }
    
});


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



