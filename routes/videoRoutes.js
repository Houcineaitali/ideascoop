const express = require("express");
const router = express.Router();

const {
    refineIdea,
    generateStoryboard,
    simulateProbability,
    getMetrics,
    generatePitch,
    startupResearch
} = require("../controllers/mainController");

// AI endpoints
router.post("/refineIdea", refineIdea);
router.post("/storyboard", generateStoryboard);
router.post("/simulate", simulateProbability);
router.get("/metrics", getMetrics);
router.post("/pitch", generatePitch);
router.post("/research", startupResearch);

module.exports = router;
