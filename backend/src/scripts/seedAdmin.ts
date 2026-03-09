import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../modules/user/user.model";

const ADMIN_EMAIL = "royalproperty@admin.com";
const ADMIN_PASSWORD = "Royaladmin!@#123";
const ADMIN_NAME = "Royal Admin";

async function seed() {
  const uri =
    process.env.MONGO_URI || "mongodb://localhost:27017/royal-property-finder";

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("✅ Connected.");

  // Check if admin already exists
  const existing = await User.findOne({ email: ADMIN_EMAIL }).select("+password");

  if (existing) {
    // If already admin, just confirm
    if (existing.role === "admin") {
      console.log(`ℹ️  Admin user already exists: ${ADMIN_EMAIL}`);
      await mongoose.disconnect();
      return;
    }
    // Upgrade role to admin
    existing.role = "admin";
    await existing.save();
    console.log(`🔄 User upgraded to admin: ${ADMIN_EMAIL}`);
    await mongoose.disconnect();
    return;
  }

  // Create a new User instance and call .save() — this triggers the pre-save
  // bcrypt hook EXACTLY ONCE (no double hashing).
  const admin = new User({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,   // plain text — hook will hash it
    authProvider: "email",
    role: "admin",
    profilePic: "",
  });

  await admin.save();

  console.log("🎉 Admin user created successfully!");
  console.log(`   Email:    ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Role:     admin`);

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("❌ Seeder failed:", err);
  process.exit(1);
});
