const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bhf5qgq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db('userCollection').collection('users')

    app.post('/add',async (req, res) => {
        const data = req.body;
        const result = await userCollection.insertOne(data)
        res.send(result)
    })


    app.get('/all',async (req, res) => {
        const data = await userCollection.find().toArray()
        res.send(data)
    })    


    app.get('/edit/:id', async (req, res) => {
        const id = req.params.id;
        const options = {
            _id: new ObjectId(id)
        };
        const result = await userCollection.findOne(options);
        res.send(result)
    })

    app.patch('/update',async (req, res) => {
        const data = req.body;
        const id = req.body.id;
        const filter = {
            _id: new ObjectId(id)
        }
        const updateDocuments = {
            $set: {
                name: data.name,
                email: data.email
            }
        }
        const options = {
            upsert: true
        }
        const result = await userCollection.updateOne(filter,updateDocuments,options)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res) => {
    res.send('Hello Something')
})




app.listen(port,() => {
    console.log(`Server is Running on ${port}`)
})