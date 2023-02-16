const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({

    
        blogName: {
          type: String,
        },
        blog: {
          type: String,
        },
        about:{
            type: String,
        },
        photoURL:{
            type: String,
        },
        link:{
            type: String,
        },
        vedio:{
            type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        user: {
          type: mongoose.Types.ObjectId,
          ref: "users",
        },
      },
      { collection: "blogs" }
    );


const model = mongoose.model(" blogs ", BlogSchema );
module.exports = model;