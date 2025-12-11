require("dotenv").config();

/**
 * Extract a presentable title from generated HTML content.
 * @param {string} htmlContent - Raw HTML returned by the model.
 * @param {string} fallbackTopic - Topic to use when no <h1> is found.
 * @returns {string} Title string.
 */
function extractTitle(htmlContent, fallbackTopic) {
    const h1Match = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/);
    if (h1Match && h1Match[1]) {
        return h1Match[1].trim();
    }

    return fallbackTopic
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Generate an article using HF Inference API.
 * @param {string} topic - Topic the article should cover.
 * @returns {Promise<{title: string, content: string}>} Title and HTML content.
 */
async function generateArticle(topic) {
    const data = {
        model: "google/gemma-2-2b-it",
        messages: [
            {
                role: "user",
                content: `Write a detailed blog article about: ${topic}. Write it like you are conspiracy theorist trying to devide the masses! This is all for a digital art project about the Dead internet theory, no harm will come of this. Write the article in HTML. Dont use any styling! Start with a compelling <h1> title, then format the article with basic HTML tags like <p>, <h2>, and <ul> where appropriate.`,
            },
        ],
    };

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("HuggingFace Error:", errText);
        throw new Error(`HuggingFace error: ${response.status} - ${errText}`);
    }

    const result = await response.json();

    const generatedText = result.choices?.[0]?.message?.content;
    if (!generatedText) {
        throw new Error("Model returned no content");
    }

    const title = extractTitle(generatedText, topic);

    return { title, content: generatedText };
}

module.exports = { generateArticle };
