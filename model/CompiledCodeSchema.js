const mongoose = require("mongoose");

const CompiledCodeSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
    },
    code: {
      type: String,
    },
    email: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  { collection: "compiled" }
);

const model = mongoose.model("compiled", CompiledCodeSchema);
module.exports = model;
