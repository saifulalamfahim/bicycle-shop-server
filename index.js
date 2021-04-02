const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5050

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ysvcd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err);
  const curdCollection = client.db("bicycleShop").collection("Curds");
  const orderCollection = client.db("bicycleShop").collection("Order");

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
    console.log(newOrder);
  })

    app.get('/Order', (req, res) => {
      // console.log(req,query.email);
      orderCollection.find({email: req.query.email})
      .toArray((err, documents) => {
          res.send(documents);
      })
    })

    app.get('/Curds', (req, res) => {
      curdCollection.find()
      .toArray((err, items) => {
       res.send(items)
      })
    })
  
    app.post('/addBicycle', (req, res) => {
        const newEvent = req.body;
        console.log('adding new bicycle:', newEvent);
        curdCollection.insertOne(newEvent)
        .then(result => {
            console.log('inserted count',result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    })

//   client.close();
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

