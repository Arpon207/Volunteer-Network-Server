import express from "express";
import { ObjectId } from "mongodb";
import { eventCollection } from "./../index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const cursor = eventCollection.find();
  const volunteers = await cursor.toArray();
  res.send(volunteers);
});

router.post("/", async (req, res) => {
  const volunteer = req.body;
  const result = await eventCollection.insertOne(volunteer);
  res.send(result);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await eventCollection.deleteOne(query);
  res.send(result);
});

export default router;
