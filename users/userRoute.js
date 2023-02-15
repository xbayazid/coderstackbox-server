const express = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const User = require("../model/UserSchema");
const userRoute = express.Router();
require("dotenv").config();

// Get
userRoute.get("/users", async (req, res) => {
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
    console.log(req.query);
    const user = await User.find({ _id: req.query.id });
    console.log(user);
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
    console.log(user);
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
  const user = await User.find(filter);
  res.send(user);
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
        message: "User logged in successfully",
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
        .send({ user, token, message: "User created successfully" });
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
    console.log(req.body);
    const filter = { _id: req.params.id };
    console.log(filter);
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
    console.log(result);
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
    console.log(filter);
    const options = {
      upsert: true,
    };
    const updatedDoc = {
      $set: {
        role: "admin",
      },
    };
    const result = await User.findOneAndUpdate(filter, updatedDoc, options);
    console.log(result);
    res.status(201).send({ result, message: "Admin got" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: "There was an error",
    });
  }
});

// Delete

module.exports = userRoute;
