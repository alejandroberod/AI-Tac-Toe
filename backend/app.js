import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;
dotenv.config();

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/ai-tac-toe", (req, res) => {
  const { board } = req.body;

  return res.status(200).json({
    move: board
  })
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
})
