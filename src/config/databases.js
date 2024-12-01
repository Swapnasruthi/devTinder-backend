const mongoose = require("mongoose");

const connectDb = async()=>{
    await mongoose.connect("mongodb+srv://swapnasruthi2005:cJqHf7r9i7KbhlXd@namastnode.ly0hp.mongodb.net/devTinder");
}
module.exports  = connectDb;
