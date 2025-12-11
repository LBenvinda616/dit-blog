require("dotenv").config();
const Article = require("../models/Article");
const aiService = require("../services/aiService");
const fs = require("fs");
const path = require("path");

// Load article topics from file
function loadTopics() {
    const topicsPath = path.join(__dirname, "../article_topics.json");
    try {
        const data = fs.readFileSync(topicsPath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Failed to load article topics:", err.message);
        return [];
    }
}

// Generate a random topic from the list
function getRandomTopic(topics) {
    if (!topics || topics.length === 0) {
        return "the nature of reality";
    }
    return topics[Math.floor(Math.random() * topics.length)];
}

// Main job function
async function generateDailyArticle() {
    console.log(`[${new Date().toISOString()}] Starting daily article generation...`);

    try {
        const topics = loadTopics();
        const topic = getRandomTopic(topics);

        console.log(`Generating article about: ${topic}`);
        const { title, content } = await aiService.generateArticle(topic);

        const newArticle = await Article.create({
            title,
            content,
            origin: "automated",
        });

        console.log(`✓ Article generated successfully with ID: ${newArticle.id}`);
        return newArticle;
    } catch (error) {
        console.error(`✗ Failed to generate daily article:`, error.message);
    }
}

module.exports = { generateDailyArticle, loadTopics };
