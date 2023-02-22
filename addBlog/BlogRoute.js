const express = require("express");
const { ObjectId } = require("mongodb");
const verifyLogin = require("../middlewares/verifyLogin");
const User = require("../model/UserSchema");
const Blogs = require("../model/BlogSchema");


const blogRoute = express.Router();

blogRoute.get("/blog", verifyLogin, async (req, res) => {

    Blogs.find({})
    .select({
      _id: 0,
      __v: 0,
      date: 0,
    })
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


//post api

blogRoute.post("/blog", verifyLogin, async (req, res) => {

    const user = await User.findOne({ email: req.decoded.email });
    if (!user) {
      res.status(400).send({ message: "Please re-login" });
    }
    const newBlog = new Blogs({
      ...req.body,
      user: user._id,
    });
    try {
      const blog = await newBlog.save();
      console.log("blog", blog);
      await User.updateOne({
          _id: user._id,
        }, {
          $push: {
            blog: blog._id
          }
        }
      )
      res.status(200).send({
        message: "Blog posted Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: "there was an error",
      });
    }
  });
module.exports = blogRoute;
