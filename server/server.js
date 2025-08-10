
require('dotenv').config();const buyNsellRouter = require("./routes/buyNsell");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
const corsOptions = {
  origin: 'http://localhost:3000', // Match your client's origin
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

mongoose.set("strictQuery", false);
require("dotenv").config();
app.use(express.urlencoded({ extended: false }));
mongoose.connect(process.env.ATLAS_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 10000 // 10 second timeout
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => {
  console.error("❌ MongoDB connection failed. Please check:");
  console.error("- Is your IP whitelisted in Atlas?");
  console.error("- Are your credentials correct?");
  console.error("- Is your cluster running?");
  console.error("Full error:", err.message);
  process.exit(1); // Exit with error
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, (req, res) => {
  console.log(`Server is running at port ${PORT}`);
});

app.use("/api", buyNsellRouter);
