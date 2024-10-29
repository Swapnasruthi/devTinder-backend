const mongoose = require("mongoose");

const connectDb = async()=>{
    await mongoose.connect("mongodb+srv://swapnasruthi2005:aqhIeS2CaAJ0vHDy@namastnode.ly0hp.mongodb.net/devTinder");
}
module.exports  = connectDb;
