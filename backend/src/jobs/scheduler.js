const cron = require("node-cron");
const { generateDailyArticle } = require("../services/articleJob");

// Schedule job to run every day at 8 AM (08:00:00)
// Cron format: second minute hour day month dayOfWeek
const job = cron.schedule("0 8 * * *", async () => {
    console.log("[Scheduler] Running daily article generation job...");
    await generateDailyArticle();
});

/**
 * Start the daily article scheduler (logs only; job auto-starts on import).
 */
function startScheduler() {
    console.log("[Scheduler] Daily article scheduler started. Next run at 8 AM.");
}

/**
 * Stop the scheduled daily article job.
 */
function stopScheduler() {
    job.stop();
    console.log("[Scheduler] Daily article scheduler stopped.");
}

module.exports = { startScheduler, stopScheduler, job };
