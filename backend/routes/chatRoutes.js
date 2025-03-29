import express from "express";
import { generateResponse } from "../services/geminiService.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await generateResponse(message);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate response" });
  }
});

export default router;
