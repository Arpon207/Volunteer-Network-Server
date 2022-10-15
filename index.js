import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import VolunteersRoute from "./routes/volunteers.js";
import EventByIdRoute from "./routes/volunteerEvents.js";
import eventRoute from "./routes/events.js";
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

export const volunteerCollection = client
  .db("Volunteer-Network")
  .collection("volunteer");

const run = async () => {
  try {
    await client.connect();

    //events
    app.use("/events", eventRoute);

    //volunteers
    app.use("/volunteers", VolunteersRoute);
    app.use("/volunteerEvents", EventByIdRoute);

    //auth
    app.use("/auth", AuthRoute);
  } finally {
  }
};

run().catch(console.dir);

app.listen(port, () => {
  console.log("listening to", port);
});

//
