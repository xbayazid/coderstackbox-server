const express = require("express");
const User = require("../model/UserSchema");
const userRoute = express.Router();
require('dotenv').config();

userRoute.put("/api/user/:email", async (req, res) => {
  const newUser = User(req.body);
  const email = req.params.email;
  const filter = { email: email };
  const options = { upsert: true };
  const updateDoc = {
    $set: newUser,
  };
  const result = await newUser.updateOne(filter, updateDoc, options);
  const token = jwt.sign(newUser, process.env.ACCESS_TOKEN, {
    expiresIn: "5h",
  });
  res.send({ result, token });
});

userRoute.post("/api/users", async (req, res) => {
  const newUser = new User(req.body);
  console.log(newUser);
  try {
    await newUser.save();
    res.status(200).json({
      message: "User created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "There was an error",
    });
  }
});

module.exports = userRoute;
