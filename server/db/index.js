import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
export default async function connectDB() {
    try {
        const db = await mongoose.connect(MONGODB_URI);
        console.log("Connected to the database:: ",db.connection.host);
    } catch (error) {
        console.log("Error in connecting to the database:: ",error);
    }

}