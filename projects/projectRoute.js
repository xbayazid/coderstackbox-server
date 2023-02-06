const express = require('express');
const Projects = require('../model/ProjectsSchema');
const projectRoute = express.Router();


projectRoute.post("/api/projects", async (req, res) => {
/*     const newProject = new Projects(req.body); */
    const newProject = new Projects({
        ...req.body,
        email: req.body.email
    });
    console.log(newProject);
    try {
        await newProject.save();
        res.status(200).json({
            message: "Project saved Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "there was an error"
        })
        
    }
  
})

module.exports = projectRoute;