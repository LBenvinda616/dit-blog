require("dotenv").config();

exports.generateArticle = async (topic) => {
    const data = {
        model: "google/gemma-2-2b-it",
        messages: [
            {
                role: "user",
                content: `Write a detailed blog article about: ${topic}. Format the article with basic HTML tags like <p>, <h1>, <h2>, and <ul> where appropriate.`,
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

    return generatedText;
};
