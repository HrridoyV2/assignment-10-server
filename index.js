const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.ypbac.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = 5000
app.use(bodyParser.json());
app.use(cors());

//

client.connect(err => {
  const tasksCollection = client.db(`${process.env.DB_Name}`).collection(`${process.env.DB_Collection}`);
  const allEvents = client.db(`${process.env.DB_Name}`).collection('allEvents');
  console.log('Db connected successfully');
//
  app.post('/addTasks', (req, res) => {
    const tasksInfo = req.body;
    tasksCollection.insertOne(tasksInfo)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })
  //
  app.get('/event', (req, res) => {
    tasksCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
  //
  app.delete('/delete/:id', (req, res) => {
    tasksCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      console.log(result);
      res.send(result.deletedCount > 0);
    })
  })
  //
  app.get('/volunteerList', (req, res) => {
    tasksCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
  //
    app.post('/addEvent', (req, res) => {
      const event = req.body;
      allEvents.insertOne(event)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
      
    })
    //
    app.get('/allEvents', (req, res) => {
      allEvents.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })
    //
      app.get('/:id/register', (req, res) => {
        allEvents.find({id: req.params.id})
        .toArray((err, documents) => {
          res.send(documents);
        })
      })
    //
});
//
  
//
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)
