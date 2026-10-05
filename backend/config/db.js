import mongoose from "mongoose";

/* Import every model whose indexes you want synced on startup.
   Add new models here as you build them. */
import MenuItem from "../models/MenuItem.js";
// import Category from "../models/Category.js";
// import Order from "../models/Order.js";
// import User from "../models/User.js";
// import Contact from "../models/Contact.js";
import Subscriber from "../models/Subscriber.js";


const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    /* Sync indexes in development so stale ones get dropped
       (e.g. the ghost "id_1" index that was causing E11000).
       In production this runs only when you opt in via env. */
    if (process.env.NODE_ENV !== "production" || process.env.SYNC_INDEXES === "true") {
      await Promise.all([
        MenuItem.syncIndexes(),
        // Category.syncIndexes(),
        // Order.syncIndexes(),
        // User.syncIndexes(),
        // Contact.syncIndexes(),
      ]);
      console.log("Indexes synced with schemas");
    }


    // inside connectDb():
if (process.env.NODE_ENV !== "production" || process.env.SYNC_INDEXES === "true") {
  await Promise.all([
    
    Subscriber.syncIndexes(),   // ← add this line

  ]);
  console.log("Indexes synced");
}


    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    /* Rethrow so the caller (server.js) can decide what to do.
       Typically you'd process.exit(1) there. */
    throw error;
  }
};

export default connectDb;