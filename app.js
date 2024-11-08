const express = require("express");
const app = express();

app.get("/hello",(req,res,next)=>{
    // res.send("from2");
    console.log("from2");
    next();
});
app.get("/hello",(req,res,next)=>{
    res.send("from 1");
    next();
  
});

app.listen(3000);
