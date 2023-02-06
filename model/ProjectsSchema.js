const mongoose = require("mongoose");

const ProjectsSchema = new mongoose.Schema(
  {
    code: {
      html: {
        type: String,
      },
      css: {
        type: String,
      },
      js: {
        type: String,
      },
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users"
    }
  },
  { collection: "projects" }
);

const model = mongoose.model("projects", ProjectsSchema);
module.exports = model;
