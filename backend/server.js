const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch"); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const HUAWEI_API_URL = process.env.HUAWEI_API_URL || "https://api-ap-southeast-1.modelarts-maas.com/v1/chat/completions";
const HUAWEI_API_KEY = process.env.HUAWEI_API_KEY || "";
const HUAWEI_MODEL = "deepseek-v3.1"; 

app.get("/", (req, res) => {
  res.send("✅ IdeaScoop backend running with Huawei DeepSeek!");
});

app.post("/api/ai/generate", async (req, res) => {
  const idea = req.body.idea;
  if (!idea) return res.status(400).json({ error: "No idea provided" });

  var analysis = {
    summary: "Demo summary: Free preview of your startup idea.",
    budget: "$10,000 - $20,000",
    riskLevel: "Medium",
    marketSize: "500,000 potential users"
  };
  var videoURL = "https://sample-videos.com/video123/mp4/480/asdasdas.mp4";
  var audioURL = "";

  try {
    if (HUAWEI_API_KEY) {
      const response = await fetch(HUAWEI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": HUAWEI_API_KEY
        },
        body: JSON.stringify({
          model: HUAWEI_MODEL,
          messages: [
            {
              role: "user",
              content: "Analyze this startup idea and respond in valid JSON with summary, budget, riskLevel, marketSize:\n\n" + idea
            }
          ]
        })
      });

      const data = await response.json();
      var raw = "";
      if (data.choices && data.choices.length > 0 && data.choices[0].content) {
        raw = data.choices[0].content;
      }
      console.log("📝 Huawei raw output:", raw);

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
    console.warn("⚠️ Huawei API failed, using demo fallback.", err.message);
  }

  res.json({
    summary: analysis.summary,
    budget: analysis.budget,
    riskLevel: analysis.riskLevel,
    marketSize: analysis.marketSize,
    videoURL: videoURL,
    audioURL: audioURL
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Backend running on port " + PORT + " with Huawei DeepSeek"));
