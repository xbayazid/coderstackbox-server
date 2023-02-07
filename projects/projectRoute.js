const express = require("express");
const verifyLogin = require("../middlewares/verifyLogin");
const Projects = require("../model/ProjectsSchema");
const User = require("../model/UserSchema");
const projectRoute = express.Router();


// Get
// Set
projectRoute.post("/projects", verifyLogin, async (req, res) => {

  const user = await User.findOne({ email: req.decoded.email });
  if (!user) {
    res.status(400).send({ message: "Please re-login" });
  }
  const newProject = new Projects({
    ...req.body,
    user: user._id,
  });
  try {
    await newProject.save();
    res.status(200).send({
      message: "Project saved Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "there was an error",
    });
  }
});
// Update
// Delete



module.exports = projectRoute;
