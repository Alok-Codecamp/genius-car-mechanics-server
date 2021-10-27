const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config();

const app=express();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mrwnd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();

        const database= client.db('carmechanic');
        const servicesCollection=database.collection('services');

        //get api

        app.get('/services',async(req,res)=>{
            const cursor=servicesCollection.find({});
            const services=await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id',async (req,res)=>{
             const id=req.params.id;
             console.log('getting specific product');
             const query={_id:ObjectId(id)};
             const service=await servicesCollection.findOne(query);
             res.json(service);
        })

        //post api
        app.post('/services',async (req,res)=>{
            const service=req.body;
           console.log('hit the post api',service);
            const result=await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        //delete api
        app.delete('/services/:id',async (req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await servicesCollection.deleteOne(query)
            res.send(result)

        })
    }
    finally{
        console.log('finally connected')
    }
}
run ().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Running genius server');
})

app.get('/hello',(req,res)=>{
    res.send('hello from updated here hello')
})

app.listen(port,()=>{
    console.log('Running genius server on port',port);
})


/* one time 

1. heroku account open
2.heroku softwere install
3. 
every project
1, git init 
.git ignore
. push everything
. make sure you have this script: "start" "node index.js"
. make sure: precess.env.Port in front or your port number
. heroku login
. heroku create (only one time for a project)
. command git push heroku main

--------
update:
.save everythig  and check locally
. git add, git commit, git push
. git push heroku main.
*/
