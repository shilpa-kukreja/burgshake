import mongoose from "mongoose";



const connectDb = async(req,res)=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    }catch (error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}


export default connectDb ;