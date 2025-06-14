import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('Database is already connected');
        return;
    }
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`, {});
        connection.isConnected = db.connections[0].readyState;
        console.log('Database connected Successfully');
    }
    catch (err) {
        console.log('Error while connecting to Database', err);
        process.exit(1)
    }
}

export default dbConnect;