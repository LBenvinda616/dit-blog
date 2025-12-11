// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
    // Maximum number of requests allowed
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 3),
    // Time window in seconds
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 300), // 5 minutes
};

// In-memory store for request tracking
// In production, consider using Redis
const requestStore = new Map();

/**
 * Rate limiter middleware for article generation.
 * Tracks requests per IP address.
 */
function rateLimiter(req, res, next) {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - (RATE_LIMIT_CONFIG.windowMs * 1000);

    // Get or create request history for this IP
    if (!requestStore.has(clientIp)) {
        requestStore.set(clientIp, []);
    }

    let requests = requestStore.get(clientIp);

    // Remove old requests outside the window
    requests = requests.filter((timestamp) => timestamp > windowStart);
    requestStore.set(clientIp, requests);

    // Check if limit exceeded
    if (requests.length >= RATE_LIMIT_CONFIG.maxRequests) {
        const oldestRequest = Math.min(...requests);
        const resetTime = new Date(oldestRequest + RATE_LIMIT_CONFIG.windowMs * 1000);
        const secondsUntilReset = Math.ceil((resetTime - now) / 1000);

        return res.status(429).json({
            error: "Rate limit exceeded",
            message: `Too many requests. Maximum ${RATE_LIMIT_CONFIG.maxRequests} requests per ${RATE_LIMIT_CONFIG.windowMs} seconds.`,
            retryAfter: secondsUntilReset,
            resetTime: resetTime.toISOString(),
        });
    }

    // Add current request timestamp
    requests.push(now);
    requestStore.set(clientIp, requests);

    // Add retry-after header
    res.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests);
    res.set('X-RateLimit-Remaining', RATE_LIMIT_CONFIG.maxRequests - requests.length);
    res.set('X-RateLimit-Reset', Math.ceil((Math.min(...requests) + RATE_LIMIT_CONFIG.windowMs * 1000) / 1000));

    next();
}

/**
 * Cleanup old entries from memory store (runs every 5 minutes).
 */
function cleanupStoreInterval() {
    setInterval(() => {
        const now = Date.now();
        const windowStart = now - (RATE_LIMIT_CONFIG.windowMs * 1000);

        for (const [ip, requests] of requestStore.entries()) {
            const filtered = requests.filter((timestamp) => timestamp > windowStart);
            if (filtered.length === 0) {
                requestStore.delete(ip);
            } else {
                requestStore.set(ip, filtered);
            }
        }

        console.log(`[RateLimit] Cleanup: ${requestStore.size} IPs tracked`);
    }, 5 * 60 * 1000); // Run every 5 minutes
}

module.exports = { rateLimiter, cleanupStoreInterval, RATE_LIMIT_CONFIG };
