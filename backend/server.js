const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const fetch = require("node-fetch"); // Node 12 compatible

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY || "" }));
const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const ELEVEN_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

// Test route
app.get("/", function (req, res) {
  res.send("✅ IdeaScoop backend running (Free Mode)!");
});
app.post("/api/ai/generate", async function (req, res) {
  var idea = req.body.idea;
  if (!idea) return res.status(400).json({ error: "No idea provided" });
      // demo ila jab lah makhdmch backend nkaliw nhad data

  var analysis = {
    summary: "Demo summary: This is a free preview analysis of your startup idea.",
    budget: "$10,000 - $20,000",
    riskLevel: "Medium",
    marketSize: "500,000 potential users"
  };
  var audioURL = ""; // placeholder
  var videoURL = "https://sample-videos.com/video123/mp4/480/asdasdas.mp4"; // placeholder

  try {
    // Try OpenAI first (free if quota available)
    if (process.env.OPENAI_API_KEY) {
      var completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a startup idea analyzer. ONLY respond in JSON with keys: summary, budget, riskLevel, marketSize."
          },
          { role: "user", content: "Analyze this startup idea:\n\n" + idea }
        ],
        temperature: 0.7
      });

      var raw = completion.data.choices[0].message.content;
      console.log("📝 OpenAI raw output:", raw);
      var jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          var parsed = JSON.parse(jsonMatch[0]);
          analysis = {
            summary: parsed.summary || analysis.summary,
            budget: parsed.budget || analysis.budget,
            riskLevel: parsed.riskLevel || analysis.riskLevel,
            marketSize: parsed.marketSize || analysis.marketSize
          };
        } catch (err) {
          console.warn("⚠️ JSON parse failed, using demo fallback.");
        }
      }
    }
  } catch (err) {
    console.warn("⚠️ OpenAI API failed or quota exceeded, using demo fallback.", err.message);
  }
  res.json({
    summary: analysis.summary,
    budget: analysis.budget,
    riskLevel: analysis.riskLevel,
    marketSize: analysis.marketSize,
    audioURL: audioURL, // placeholder
    videoURL: videoURL  // placeholder
  });
});
var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log("🚀 Backend running on port " + PORT + " (Free Mode)");
});
