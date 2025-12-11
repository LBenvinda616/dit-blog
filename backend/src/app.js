require("dotenv").config();
const express = require("express");
const app = express();
const articlesRoutes = require("./routes/articles");
const { startScheduler } = require("./jobs/scheduler");
const { cleanupStoreInterval } = require("./middleware/rateLimiter");

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json()); // IMPORTANT

app.use("/api/articles", articlesRoutes);

const sequelize = require("./config/database");
require("./models/Article"); // register model

sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced");

    // Start the daily article scheduler
    startScheduler();

    // Start rate limiter cleanup
    cleanupStoreInterval();

    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
});


