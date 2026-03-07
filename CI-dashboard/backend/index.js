const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const roleRoutes = require("./routes/roleRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));


app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admins", adminRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});   
