const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const shortid = require("shortid");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kdxcg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_ORDERs}`);

  app.get("/get-all-products", (req, res) => {
    productCollection.find({}).toArray((err, products) => {
      res.send(products);
    });
  });

  app.post("/add-product", (req, res) => {
    const product = req.body;
    console.log(product);
    productCollection.insertOne(product).then((result) => {
      res.send(result);
    });
  });

  app.delete("/delete-product/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    productCollection
      .deleteOne({
        _id: ObjectId(id),
      })
      .then((result) => {
        res.send(result);
      });
  });

  app.post("/create-order", (req, res) => {
    const order = { _id: shortid.generate(), ...req.body };
    orderCollection.insertOne(order).then((result) => res.send(order));
  });

  console.log("DB Connected");
});

app.listen(process.env.PORT || 5000);
