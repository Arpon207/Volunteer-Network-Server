import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import VolunteersRoute from "./routes/volunteers.js";
import EventByIdRoute from "./routes/volunteerEvents.js";
import AuthRoute from "./routes/auth.js";

const app = express();
const port = process.env.PORT || 5000;
import { MongoClient, ServerApiVersion } from "mongodb";
import { verifyToken } from "./utils/verifyToken.js";

dotenv.config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Volunteer Network Server.");
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

export const eventCollection = client
  .db("Volunteer-Network")
  .collection("events");

const run = async () => {
  try {
    await client.connect();
    const volunteerCollection = client
      .db("Volunteer-Network")
      .collection("volunteer");

    // post events
    app.post("/events", verifyToken, async (req, res) => {
      const event = req.body;
      const email = req.query.email;
      const decodedEmail = req.decoded.email;
      if (email === decodedEmail) {
        const result = await volunteerCollection.insertOne(event);
        res.send(result);
      } else {
        return res.status(403).send({ message: "forbidden access" });
      }
    });

    //get events
    app.get("/events", async (req, res) => {
      const query = {};
      const cursor = volunteerCollection.find(query);
      const volunteers = await cursor.toArray();
      res.send(volunteers);
    });

    // get volunteers

    app.use("/volunteers", VolunteersRoute);

    app.use("/volunteerEvents", EventByIdRoute);

    app.use("/auth", AuthRoute);
  } finally {
  }
};

run().catch(console.dir);

app.listen(port, () => {
  console.log("listening to", port);
});

//
