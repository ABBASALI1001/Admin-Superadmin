const mongoose = require("mongoose");
require("dotenv").config();

const roleSchema = new mongoose.Schema({ name: String });
const Role = mongoose.model("Role", roleSchema);

const INITIAL_ROLES = [
  "Fully Remote Agent",
  "Inbound & Outbound Sales Representative",
  "Work From Home Account Agent",
  "Remote Account Associate",
  "Remote Digital Sales Representative",
  "Remote Accounts Specialist",
  "Remote Account Coordinator",
  "Remote Client Sales Account Representative",
  "Work From Home Client Advisor",
  "Client Acquisition Specialist",
  "Work From Home Agent",
  "Work From Home Account Coordinator",
  "Remote Financial Sales Consultant",
];

async function seedRoles() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Role.deleteMany({});
  await Role.insertMany(INITIAL_ROLES.map((name) => ({ name })));

  console.log("Seeded roles successfully");
  process.exit();
}

seedRoles();
