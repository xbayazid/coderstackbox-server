const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
    },
    photoURL: {
        type: String,
    },
  },
  { collection: "users" }
);

const model = mongoose.model("users", UserSchema);
module.exports = model;
