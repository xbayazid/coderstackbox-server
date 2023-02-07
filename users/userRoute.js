const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");
const userRoute = express.Router();
require('dotenv').config();


userRoute.put("/user/:email", async (req, res) => {
  /* const user = User(req.body);
  const email = req.params.email;
  const filter = { email: email };
  const options = { upsert: true , new: true };
  const updateDoc = {
    $set: user,
  };
  const result = await User.updateOne(filter, updateDoc, options);
  const token = jwt.sign({user}, process.env.ACCESS_TOKEN, {
    expiresIn: "5h",
  });
  console.log(token);
  res.send({ result, token }); */
  const user = User(req.body);
const token = jwt.sign({user}, process.env.ACCESS_TOKEN, {
    expiresIn: "5h",
  });
  const checkUserEmail = await User.findOne({email: req.params.email})
  if(checkUserEmail){
    /* res.status(401).json({
      success: false,
      message: "User already Exist with this email id",
    }).send({
      token
    }) */
    res.send({ checkUserEmail, token });
  }else{
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
    });
     /* res.status(200).json({
      success: true,
      message: "success",
      user: user
    }).send({
      user,
      token
    }) */
    res.send({ user, token })
  }


});

userRoute.put("/users", async (req, res) => {
  const newUser = User(req.body);
  console.log(newUser);
  const { name, email } = newUser;
   const filter = { email: email };
  const options = { upsert: true };
  const updateDoc = {
    $set: newUser,
  };
  try {
    const result = await newUser.updateOne(filter, updateDoc, options);

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
