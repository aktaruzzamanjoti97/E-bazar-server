const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
// const ObjectId = require('mongodb').ObjectId

const port = process.env.PORT||5000;

const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkoox.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("sobzibazarBd").collection("bookings");
  const ordersCollection = client.db("sobzibazarBd").collection("orders");
  console.log('database connected');

  app.post('/admin', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event', newEvent);
    productCollection.insertOne(newEvent)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

 app.get('/product', (req, res) => {
   productCollection.find({})
   .toArray((err, items)=>{
     res.send(items)
   })
 })

 app.delete('/delete/:id', (req, res) => {
  const id = ObjectId(req.params.id);
  productCollection.deleteOne({_id: id})
  .then(document => {
    res.send(document);
  })
 })

app.get('/orders/:id', (req, res) => {
  productCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, documents) => {
    res.send(documents)
  })
})

 app.post('/productsByOrder', (req, res) => {
   console.log(req.body);
   const orderProducts = req.body;
   ordersCollection.insertOne(orderProducts)
   .then((result) => {
     console.log('Showing Ordered', result.insertedCount);
     res.send(result.insertedCount > 0)
   })
 })

 app.get('/placeOrders', (req, res) => {
  ordersCollection.find({userEmail: req.query.email})
  .toArray((err, documents) => {
    res.send(documents);
  })
})

 
  // client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})