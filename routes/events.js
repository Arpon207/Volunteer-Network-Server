import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { volunteerCollection } from "./../index.js";

const router = express.Router();
//get events
router.get("/", async (req, res) => {
  const searchText = req.query.searchText;
  const query = searchText
    ? { eventTitle: { $regex: searchText, $options: "i" } }
    : {};
  const cursor = volunteerCollection.find(query);
  const volunteers = await cursor.toArray();
  res.send(volunteers);
});

//post events
router.post("/events", verifyToken, async (req, res) => {
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

export default router;
