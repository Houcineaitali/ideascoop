// ===============================
// ✅ IDEA SCOOP - BACKEND SERVER
// ===============================

// Import dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables from .env
dotenv.config();

// Create express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Simple route to test server
app.get("/", (req, res) => {
  res.send("✅ IdeaScoop backend is running!");
});

// AI generation endpoint
app.post("/api/ai/generate", async (req, res) => {
  const { idea } = req.body;
  if (!idea) {
    return res.status(400).json({ error: "No idea provided" });
  }

  try {
    console.log("🧠 Generating analysis for idea:", idea);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4-turbo if available
      messages: [
        {
          role: "system",
          content:
            "You are a startup idea analyzer. Respond in JSON with summary, estimated budget, riskLevel, and marketSize."
        },
        {
          role: "user",
          content: `Analyze this startup idea and respond in valid JSON format only:\n\nIdea: ${idea}`
        }
      ],
      temperature: 0.8
    });

    const raw = completion.choices[0].message.content;
    console.log("📝 Raw GPT output:", raw);

    // Try to parse JSON safely
    let result;
    try {
      result = JSON.parse(raw);
    } catch (err) {
      console.error("⚠️ JSON parse failed, returning raw text instead.");
      result = {
        summary: raw,
        budget: "N/A",
        riskLevel: "N/A",
        marketSize: "N/A"
      };
    }

    // Send back to frontend
    res.json({
      summary: result.summary,
      budget: result.budget,
      riskLevel: result.riskLevel,
      marketSize: result.marketSize,
      videoURL: "#" // Placeholder for now
    });

  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate idea analysis." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
