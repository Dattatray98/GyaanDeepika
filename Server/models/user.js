const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Common fields
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },

  // Manual Sign-up fields
  mobile: {
    type: String,
  },
  password: {
    type: String,
  },

  // Google OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true, // allows null but ensures uniqueness if present
  },

}, { timestamps: true });

const User = mongoose.model("User", userSchema, "users");
module.exports = User;
