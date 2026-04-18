require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const Admin = require("./models/admin.model");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    createAdmin();
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

async function createAdmin() {
  const admin = new Admin();
  
  // Using email prefix as username (max 20 chars)
  admin.username = "shreyasr";
  admin.password = "Nexus@Admin123";

  try {
    await admin.save();
    console.log(`\n✓ Admin account created successfully!\n`);
    console.log(`Username: ${admin.username}`);
    console.log(`Password: Nexus@Admin123`);
    console.log(`\nYou can now login at http://localhost:3000/admin`);
  } catch (error) {
    if (error.message.includes("duplicate key error")) {
      console.log(`✗ Username "${admin.username}" is already taken.`);
    } else {
      console.log(`✗ Error: ${error.message}`);
    }
  } finally {
    mongoose.connection.close();
  }
}
