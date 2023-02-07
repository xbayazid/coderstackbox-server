const express = require("express");
const verifyLogin = require("../middlewares/verifyLogin");
const Projects = require("../model/ProjectsSchema");
const User = require("../model/UserSchema");
const projectRoute = express.Router();

/* projectRoute.put("/projects", verifyLogin, async (req, res) => {
    const { name, email, _id } = req.decoded.user;
  try {
    const project = await Projects.create({
      html: req.body.html,
      css: req.body.css,
      js: req.body.js,
      user: { name, email, _id },
    });
    res.status(201).send({ project, message: "Project created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was an error",
    });
  }
}); */


projectRoute.put("/projects", verifyLogin, async (req, res) => {

  const user = await User.findOne({ email: req.decoded.email });
  const newProject = new Projects({
    ...req.body,
    user: user._id,
  });
  try {
    await newProject.save();
    res.status(200).json({
      message: "Project saved Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "there was an error",
    });
  }
});

module.exports = projectRoute;
