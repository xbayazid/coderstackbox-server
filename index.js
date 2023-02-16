"use strict";
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
const projectRoute = require("./projects/projectRoute");
const userRoute = require("./users/userRoute");
const blogRoute = require("./addBlog/BlogRoute");

app.use(cors());
app.use(express.json());

/* // MongoDb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4n6qqjh.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 */

/* ----------Database Connection---------- */
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4n6qqjh.mongodb.net/codersStackBox?retryWrites=true&w=majority`;
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB!!!");
  }
);

app.post("/projects", projectRoute);
app.post("/compiled-code", projectRoute);
app.get("/collections", projectRoute);
app.get("/user-collections", projectRoute);
app.get("/users", userRoute);
app.get("/user", userRoute);
app.get("/u", userRoute);
app.get("/u/:id", userRoute);
app.put("/u/:id", userRoute);
app.put("/u/admin/:id", userRoute);
app.put("/user/:email", userRoute);
app.post("/blog", blogRoute);
app.get("/blog", blogRoute);

app.get("/", async (req, res) => {
  res.send("CodersStackBox server is running");
});

app.listen(port, () => console.log(`CodersStackBox sever running on ${port}`));
