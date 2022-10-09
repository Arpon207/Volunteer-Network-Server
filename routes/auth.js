import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/getToken", (req, res) => {
  const email = req.body;
  console.log(email);
  const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  res.send({ accessToken });
});

export default router;
