const mongoose = require("mongoose");

const ProjectsSchema = new mongoose.Schema(
  {
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
  { collection: "projects" }
);

const model = mongoose.model("projects", ProjectsSchema);
module.exports = model;
