const express = require("express");
const { ObjectId } = require("mongodb");
const verifyLogin = require("../middlewares/verifyLogin");
const Projects = require("../model/ProjectsSchema");
const CompiledCode = require("../model/CompiledCodeSchema");
const User = require("../model/UserSchema");
const projectRoute = express.Router();


// Get
projectRoute.get("/collections", async (req, res) => {

  Projects.find({})
  .populate("user", "-_id")
  .sort({date: 'desc'})
  .exec((err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        result: data,
        message: "Success",
      });
    }
  });
});

projectRoute.get("/user-collections", verifyLogin, async (req, res) => {

  const user = await User.findOne({ email: req.decoded.email });
  if (user) {
    res.status(400).send({ message: `${ObjectId(user._id)}` });
  } 

  Projects.find({ user: (user._id) })
  .populate("collections")
  .sort({date: 'desc'})
  .exec((err, data) => {
    console.log(data)
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        result: data,
        message: "Success",
      });
    }
  });
});


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
    const project = await newProject.save();
    await User.updateOne({
        _id: user._id,
      }, {
        $push: {
          project: project._id
        }
      }
    )
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

projectRoute.post("/compiled-code", verifyLogin, async (req, res) => {

  const user = await User.findOne({ email: req.decoded.email });
  if (!user) {
    res.status(400).send({ message: "Please re-login" });
  }
  const newProject = new CompiledCode({
    ...req.body,
    user: user._id,
  });
  try {
    const project = await newProject.save();
    await User.updateOne({
        _id: user._id,
      }, {
        $push: {
          project: project._id
        }
      }
    )
    console.log("project", project)
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
