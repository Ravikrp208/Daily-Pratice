import mongoose from "mongoose";

function connectDB() 
{
    mongoose.connect("mongodb://localhost:27017/mernstack", {
    
    })
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    
    .catch((err) => {
        console.log("MongoDB connection failed", err);
    }   
    )
}   

export default connectDB;