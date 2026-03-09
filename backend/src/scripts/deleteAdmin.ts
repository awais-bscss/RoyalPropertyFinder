import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/royal-property-finder");
  const result = await mongoose.connection.db!.collection("users").deleteOne({ email: "royalproperty@admin.com" });
  console.log(`🗑️  Deleted old admin: ${result.deletedCount} doc(s)`);
  await mongoose.disconnect();
}

cleanup().catch(console.error);
