import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const DbConnect =async ()=>{
    try {
      const res=  await mongoose.connect(
            process.env.MONGODB_URI,
        )
        console.log(" MongoDB connected successfully");
        return res;        
    } catch (error) {
        console.error(" Error connecting to MongoDB:", error);   
         process.exit(1); // don't continue if DB isn't ready   

    }
}

export default DbConnect;



