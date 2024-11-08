const mongoose = require("mongoose");

const connectDb = async()=>{
    await mongoose.connect("mongodb+srv://swapnasruthi2005:ZCmocDbUmnunSzD5@namastnode.ly0hp.mongodb.net/devTinder");
}
module.exports  = connectDb;
