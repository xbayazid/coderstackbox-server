const express = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyLogin = require("../middlewares/verifyLogin");
const User = require("../model/UserSchema");
const userRoute = express.Router();
require("dotenv").config();

// Get
userRoute.get("/users", verifyLogin, verifyAdmin, async (req, res) => {
  try {
    User.find({})
    .populate("project")
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
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

userRoute.get("/user", async (req, res) => {
  try {
    const user = await User.find({ _id: req.query.id })
    .populate('project')
    res.status(200).json({
      result: user,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});
userRoute.get("/u/:id", async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    res.status(200).json({
      result: user,
      message: "Success",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

userRoute.get("/u", async (req, res) => {
  const filter = { email: req.query.email };
  
    try {
      User.find(filter)
      .populate("project")
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
    } catch (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    }
 
});

// Set
// Update
userRoute.put("/user/:email", async (req, res) => {
  try {
    const { name, email, photoURL } = User(req.body);

    const token = jwt.sign(
      { name, email, photoURL },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "5h",
      }
    );
    const checkUserEmail = await User.findOne({ email: req.params.email });
    if (checkUserEmail) {
      res.status(200).send({
        checkUserEmail,
        token,
        message: `Hi! ${name} WellCome back again!`
      });
    } else {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        photoURL: req.body.photoURL,
      });
      res
        .status(201)
        .send({ user, token, message: `Hi! ${user.name} WellCome to CodersStackBox`});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was an error",
    });
  }
});

userRoute.put("/u/:id", async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const options = {
      upsert: true,
    };
    const updatedDoc = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        about: req.body.about,
        photoURL: req.body.photoURL,
      },
    };
    const result = await User.findOneAndUpdate(filter, updatedDoc, options);
    res.status(201).send({ result, message: "User updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "There was an error",
    });
  }
});
userRoute.put("/u/admin/:id", async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const options = {
      upsert: true,
    };
    const updatedDoc = {
      $set: {
        role: "admin",
      },
    };
    const result = await User.findOneAndUpdate(filter, updatedDoc, options);
    res.status(201).send({ result, message: "Assign admin successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "There was an error",
    });
  }
});

// Delete
userRoute.delete("/user/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error!",
      });
    } else {
      res.status(200).json({
        message: "User deleted successfully!",
      });
    }
  });
});

module.exports = userRoute;
