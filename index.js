const express = require('express'); 
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
app.use(cors());
app.use(express.json());

// MongoDb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4n6qqjh.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const bestDevelopersCollection = client.db('codersStackBox').collection('bestDevelopers');
        const recentProjectsCollection = client.db('codersStackBox').collection('recentProjects');
        const projectCategoriesCollection = client.db('codersStackBox').collection('projectCategories');
        const projectsCollection = client.db('codersStackBox').collection('projects');
        const developersCollection = client.db('codersStackBox').collection('developers');
        const repotedDeveloperCollection = client.db('codersStackBox').collection('repotedDevelopers');

        app.get('/bestDevelopers', async(req, res)=>{
            const query = {}
            const cursor = bestDevelopersCollection.find(query);
            const developers = await cursor.toArray();
            res.send(developers);
        });

        app.get('/bestDevelopers/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const developer = await bestDevelopersCollection.findOne(query);
            res.send(developer);
        });

        app.get('/recentProjects', async(req, res)=>{
            const query = {}
            const cursor = recentProjectsCollection.find(query);
            const projects = await cursor.toArray();
            res.send(projects);
        });

        app.get('/recentProjects/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const project = await recentProjectsCollection.findOne(query);
            res.send(project);
        })

        // All project categories get api
        app.get('/projectCategories', async(req, res)=> {
            const query = { };
            const projectCategories = await projectCategoriesCollection.find(query).toArray();
            res.send(projectCategories);
        })

        // All Projects get api
        app.get('/projects', async(req, res)=> {
            const query = { };
            const projects = await projectsCollection.find(query).toArray();
            res.send(projects);
        })

        // Category id based projects get api
        app.get('/projects/:id', async(req, res)=> {
            const id = req.params.id;
            const query = { categoryId: id };
            const categoryBasedProjects = await projectsCollection.find(query).toArray();
            res.send(categoryBasedProjects);
        })

        // single id based one project get api
        app.get('/project/:id', async(req, res)=> {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleIdBasedProject = await projectsCollection.findOne(query);
            res.send(singleIdBasedProject);
        })

        //developer all get api//

        app.get('/developers', async(req, res) => {
            const query = {};
            const cursor = developersCollection.find(query)
            const developer = await cursor.toArray();
            res.send(developer);
        })

        //id based developer api//

        app.get('/developers/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const developerId = await developersCollection.findOne(query);
            res.send(developerId);
        })

        //email based developer api //

        app.get('/developers', async(req, res)=>{
            const email = req.query.email;
            const query = { developerEmail: email };
            const developer = await developersCollection.findOne(query);
            res.send(developer);
        })

        //repotedDeveloperCollection all get api//
        app.get('/repotedDevelopers', async (req, res) => {
            const query = {};
            const repotedDevelopers = await repotedDeveloperCollection.find(query).toArray();
            res.send(repotedDevelopers);
        })

        app.get('/repotedDevelopers/:id', async(req, res) => {
            const id = req.params.id;
            const query ={ _id: ObjectId (id) };
            const repotedDeveloperId = await repotedDeveloperCollection.findOne(query);
            res.send(repotedDeveloperId);
        })

        app.get('/reportedDevelopers', async(req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { reporterEmaill: email };
            const repotedDeveloperEmail = await repotedDeveloperCollection.findOne(query);
            res.send(repotedDeveloperEmail);
        })

    }
    finally{

    }
}

run().catch(error => console.log(error));

app.get('/', async(req, res)=>{
    res.send('CodersStackBox server is running');
})

app.listen(port, ()=> console.log(`CodersStackBox sever running on ${port}`));