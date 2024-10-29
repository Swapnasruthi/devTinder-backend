const express = require("express");
const {adminAuth} = require("./middlewares/auth");
const app = express();


app.use("/admin",adminAuth)
app.use("/admin/login",(req,res)=>{
    res.send("user login");
});

app.use("/admin/delete",(req,res)=>{
    res.send("user deleted");
})


app.listen(3000);
