const mongoose = require("mongoose");

const ProjectsSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
    },
    html: {
      type: String,
    },
    css: {
      type: String,
    },
    js: {
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
  { collection: "collections" }
);

const model = mongoose.model("collections", ProjectsSchema);
module.exports = model;
