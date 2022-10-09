import express from "express";
import { ObjectId } from "mongodb";
import { eventCollection } from "../index.js";
import { verifyToken } from "./../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const decodedEmail = req.decoded.email;
  const email = req.query.email;
  if (email === decodedEmail) {
    const query = { email: email };
    const cursor = eventCollection.find(query);
    const events = await cursor.toArray();
    res.send(events);
  } else {
    return res.status(403).send({ message: "forbidden access" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await eventCollection.deleteOne(query);
  res.send(result);
});

export default router;
