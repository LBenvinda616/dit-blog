const Article = require("../models/Article");
const aiService = require("../services/aiService");

exports.generateNewArticle = async (req, res) => {
    try {
        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({ error: "Missing 'topic'" });
        }

        // Generate text using AI
        const { title, content } = await aiService.generateArticle(topic);

        // Save to database
        const newArticle = await Article.create({
            title,
            content,
            origin: "user",
        });

        res.json(newArticle);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllArticles = async (req, res) => {
    const articles = await Article.findAll({ order: [["createdAt", "DESC"]] });
    res.json(articles);
};

exports.getArticleById = async (req, res) => {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
        return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
};
