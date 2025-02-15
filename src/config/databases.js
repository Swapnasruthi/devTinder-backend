const mongoose = require("mongoose");

const connectDb = async()=>{
    await mongoose.connect(process.env.DATABASE_STRING);
}
module.exports  = connectDb;
