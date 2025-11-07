import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;

app.get("/", (req, res) => {
  res.send("✅ IdeaScoop creative backend is running!");
});

app.post("/api/ai/generate", async (req, res) => {
  const { idea } = req.body;
  if (!idea) {
    return res.status(400).json({ error: "No idea provided" });
  }

  try {
    console.log("🧠 Analyzing startup idea:", idea);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are a startup analyst and creative narrator.
            Respond ONLY in valid JSON:
            {
              "summary": "...",
              "budget": "...",
              "riskLevel": "...",
              "marketSize": "...",
              "script": "Creative 1-minute video narration about this idea."
            }
          `,
        },
        {
          role: "user",
          content: `Analyze and narrate this startup idea: ${idea}`,
        },
      ],
      temperature: 0.85,
    });

    const raw = completion.choices[0].message.content;
    console.log("📝 Raw GPT Output:", raw);

    let result;
    try {
      result = JSON.parse(raw);
    } catch (err) {
      console.error("⚠️ JSON parse failed.");
      result = {
        summary: raw,
        budget: "N/A",
        riskLevel: "N/A",
        marketSize: "N/A",
        script: "No script generated.",
      };
    }

    console.log("🎤 Generating voice narration...");
    const voiceId = "pNInz6obpgDQGcFmaJgB"; 
    const audioUrl = await generateVoice(result.script, voiceId);

    res.json({
      summary: result.summary,
      budget: result.budget,
      riskLevel: result.riskLevel,
      marketSize: result.marketSize,
      script: result.script,
      audio: audioUrl,
    });
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({ error: "AI generation failed." });
  }
});

// 🗣 ElevenLabs voice generation helper
async function generateVoice(text, voiceId) {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
          },
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to generate voice");

    // Save audio locally (optional)
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.resolve(`./output-${Date.now()}.mp3`);
    fs.writeFileSync(filePath, buffer);

    console.log("✅ Voice generated and saved:", filePath);
    return filePath;
  } catch (error) {
    console.error("🎧 ElevenLabs Error:", error);
    return null;
  }
}

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Creative backend running on port ${PORT}`));
