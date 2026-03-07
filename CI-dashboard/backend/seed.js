const mongoose = require("mongoose");
require("dotenv").config();

const employeeSchema = new mongoose.Schema({
  name: String,
  totalCount: Number,
});

const Employee = mongoose.model("Employee", employeeSchema);

const INITIAL_EMPLOYEES = [
  { name: "Khushi", totalCount: 25 },
  { name: "Riju", totalCount: 0 },
  { name: "Dipika", totalCount: 10 },
  { name: "Greesh", totalCount: 30 },
  { name: "Devapriya", totalCount: 30 },
  { name: "Bipasa", totalCount: 0 },
  { name: "Sagar", totalCount: 0 },
  { name: "Bhima", totalCount: 25 },
  { name: "Naveen", totalCount: 25 },
  { name: "Sky", totalCount: 0 },
  { name: "Raj Kumar", totalCount: 0 },
  { name: "Manohar", totalCount: 0 },
  { name: "Samriddhi", totalCount: 0 },
  { name: "Anushka", totalCount: 0 },
  { name: "Nandini", totalCount: 0 },
  { name: "Shreya", totalCount: 0 },
  { name: "Tannishtha", totalCount: 0 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Employee.deleteMany({});
  await Employee.insertMany(INITIAL_EMPLOYEES);

  console.log("Seeded employees successfully");
  process.exit();
}

seed();
