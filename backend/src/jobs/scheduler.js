const cron = require("node-cron");
const { generateDailyArticle } = require("./dailyArticleJob");

// Schedule job to run every day at 8 AM (08:00:00)
// Cron format: second minute hour day month dayOfWeek
const job = cron.schedule("0 8 * * *", async () => {
    console.log("[Scheduler] Running daily article generation job...");
    await generateDailyArticle();
});

function startScheduler() {
    console.log("[Scheduler] Daily article scheduler started. Next run at 8 AM.");
}

function stopScheduler() {
    job.stop();
    console.log("[Scheduler] Daily article scheduler stopped.");
}

module.exports = { startScheduler, stopScheduler, job };
