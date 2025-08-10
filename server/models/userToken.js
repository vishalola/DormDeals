const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,// Make sure this matches your User model name
  },
  token: {
    type: String,
    required: true,
    unique: true // Important to prevent duplicates
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // 7 days in seconds (matches token expiry)
  }
});

module.exports = mongoose.model("UserToken", userTokenSchema);