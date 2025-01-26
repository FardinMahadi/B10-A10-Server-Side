const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// ChillGamer
// DQrcum68xnOVIRbl

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kbm4w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("ChillGamer");
    const usersCollection = database.collection("users");

    app.get("/users", async (req, res) => {
      const email = req.query.email;

      try {
        const user = await usersCollection.findOne({ email: email });

        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Users Management server is running");
});

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
