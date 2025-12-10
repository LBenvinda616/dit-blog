const express = require("express");
const router = express.Router();
const controller = require("../controllers/articlesController");
const { rateLimiter } = require("../middleware/rateLimiter");

router.get("/", controller.getAllArticles);
router.get("/:id", controller.getArticleById);
router.post("/generate", rateLimiter, controller.generateNewArticle);


module.exports = router;
