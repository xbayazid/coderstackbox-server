const express = require("express");
const { ObjectId } = require("mongodb");
const verifyLogin = require("../middlewares/verifyLogin");
const Projects = require("../model/ProjectsSchema");
const CompiledCode = require("../model/CompiledCodeSchema");
const User = require("../model/UserSchema");
const projectRoute = express.Router();


// Get
projectRoute.get("/collections", async (req, res) => {

  const PAGE_SIZE = parseInt(req.query.limit || {});;
  const page = parseInt(req.query.page || "0");
  const total = await Projects.countDocuments({});

  Projects.find({}).limit(PAGE_SIZE).skip(PAGE_SIZE * page)
  .populate("user", "-_id")
  .sort({date: 'desc'})
  .exec((err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        totalPages: Math.ceil(total / PAGE_SIZE),
        result: data,
        message: "Success",
      });
    }
  });
});

projectRoute.get("/user-collections", verifyLogin, async (req, res) => {

  Projects.find({ user: (req.query.id) })
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
projectRoute.put("/code/:id", async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const options = {
      upsert: true,
    };
    const updatedDoc = {
      $set: {
        ...req.body,
      },
    };
    const result = await Projects.findOneAndUpdate(filter, updatedDoc, options);
    res.status(201).send({ result, message: "Project updated successfully" });
    console.log("result");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "There was an error",
    });
  }
});
// Delete
projectRoute.delete("/code/:id", async (req, res) => {
  
  Projects.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        message: `Deleted Successfully`,
      });
    }
  });
});


module.exports = projectRoute;
