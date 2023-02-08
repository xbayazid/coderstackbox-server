const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");
const userRoute = express.Router();
require('dotenv').config();


// Get
// Set
// Update
// Delete

userRoute.put("/user/:email", async (req, res) => {
 try {
  const { name, email, photoURL } = User(req.body);

  const token = jwt.sign({ name, email, photoURL }, process.env.ACCESS_TOKEN, {
      expiresIn: "5h",
    });
    const checkUserEmail = await User.findOne({email: req.params.email})
    if(checkUserEmail){
      res.status(200).send({ checkUserEmail, token, message: 'User logged in successfully' });
    }else{
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        photoURL: req.body.photoURL
      });
      res.status(201).send({ user, token, message: 'User created successfully' });
    }
 } catch (error) {
  console.log(error);
    res.status(500).json({
      error: "There was an error",
    });
  }
});

/* userRoute.put("/users", async (req, res) => {
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
}); */

module.exports = userRoute;
