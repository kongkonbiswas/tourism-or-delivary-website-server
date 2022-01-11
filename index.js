const express = require("express");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvbhx.mongodb.net/online_service?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db("tourism_service");
    const events = database.collection("events");
    const registration = database.collection("registration");

    app.get("/events", async (req, res) => {
      const result = await events.find({}).toArray();
      res.send(result);
    });
    app.get("/register/", async (req, res) => {
      const result = await registration.find({}).toArray();
      res.json(result);
    });

    app.post("/register/", async (req, res) => {
      const result = await registration.insertOne(req.body);
      res.json(result);
    });

    app.delete(`/register/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await registration.deleteOne(query);
      res.json(result);
    });

    app.post(`/events/`, async (req, res) => {
      const query = { email: { $in: [req.body.email] } };
      console.log(req.body);
      const result = await registration.find(query).toArray();
      res.json(result);
    });

    app.delete(`/events/:id`, async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await registration.deleteOne(query);
      res.json(result);
    });
  } finally {
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`website listening at http://localhost:${port}`);
});
