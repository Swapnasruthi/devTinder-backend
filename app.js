const express = require("express");
const app = express();
const connectDb = require("./src/config/databases");
const User = require("./src/models/user");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initialise = require("./src/utils/socket");

require('dotenv').config();


app.use(cors(
    {
        origin:"http://localhost:5173",
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials:true
    }
));

app.options('*', cors());
app.use(cookieParser());  //--> to read cookies from the request.
app.use(express.json());  //--> to read json data from the Db.



const profileAuth = require("./src/routes/profile");
const authRouter = require("./src/routes/auth");
const requestAuth = require("./src/routes/request");
const userAuth = require("./src/routes/user");
const chatRouter = require("./src/routes/chat");

app.use("/",chatRouter);
app.use("/",profileAuth);
app.use("/",requestAuth);
app.use("/",authRouter);
app.use("/",userAuth);


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
const server = http.createServer(app);
initialise(server);


const PORT = process.env.PORT || 4000;
connectDb()
.then(
    ()=>{
        console.log("connected successfully!");
        server.listen(PORT,()=>{
            console.log("server connected at "+PORT+" successfully!");
        });
    }
       
)
.catch(
    (err)=>{
        console.error("Database cannot be connected"+err.name);
    }
)


