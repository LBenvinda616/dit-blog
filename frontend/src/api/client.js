// API client: minimal wrappers around backend endpoints.
// Exports:
// - fetchArticles(): GET /api/articles → Array<Article>
// - generateArticle(topic: string): POST /api/articles/generate → Article
// Handles JSON parsing and error normalization for UI consumption.
// Default to relative /api so Vite dev proxy handles CORS; allow override for deployments.
const base = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function handleResponse(res) {
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const error = new Error(data.message || data.error || `Request failed with ${res.status}`);

        // Attach rate limit info if available
        if (res.status === 429) {
            error.retryAfter = data.retryAfter;
            error.resetTime = data.resetTime;
        }

        throw error;
    }
    return res.json();
}

export async function fetchArticles() {
    const res = await fetch(`${base}/articles/`);
    return handleResponse(res);
}

export async function generateArticle(topic) {
    const res = await fetch(`${base}/articles/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic })
    });
    return handleResponse(res);
}
