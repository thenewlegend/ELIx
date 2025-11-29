// In-memory rate limiter for API requests
// Tracks requests per IP address with 1-hour sliding window

const rateLimitStore = new Map();
const RATE_LIMIT = 10; // queries per window
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Check if an IP address has exceeded the rate limit
 * @param {string} ip - Client IP address
 * @returns {{ allowed: boolean, remaining: number, resetTime: number }}
 */
export function checkRateLimit(ip) {
    const now = Date.now();

    // Get or create entry for this IP
    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, []);
    }

    const requests = rateLimitStore.get(ip);

    // Remove requests older than 1 hour
    const recentRequests = requests.filter(timestamp => now - timestamp < WINDOW_MS);
    rateLimitStore.set(ip, recentRequests);

    // Check if limit exceeded
    if (recentRequests.length >= RATE_LIMIT) {
        const oldestRequest = Math.min(...recentRequests);
        const resetTime = oldestRequest + WINDOW_MS;

        return {
            allowed: false,
            remaining: 0,
            resetTime,
            limit: RATE_LIMIT
        };
    }

    // Add current request
    recentRequests.push(now);
    rateLimitStore.set(ip, recentRequests);

    return {
        allowed: true,
        remaining: RATE_LIMIT - recentRequests.length,
        resetTime: now + WINDOW_MS,
        limit: RATE_LIMIT
    };
}

/**
 * Get current rate limit status for an IP
 * @param {string} ip - Client IP address
 * @returns {{ remaining: number, limit: number, resetTime: number }}
 */
export function getRateLimitStatus(ip) {
    const now = Date.now();

    if (!rateLimitStore.has(ip)) {
        return {
            remaining: RATE_LIMIT,
            limit: RATE_LIMIT,
            resetTime: now + WINDOW_MS
        };
    }

    const requests = rateLimitStore.get(ip);
    const recentRequests = requests.filter(timestamp => now - timestamp < WINDOW_MS);

    const oldestRequest = recentRequests.length > 0 ? Math.min(...recentRequests) : now;

    return {
        remaining: Math.max(0, RATE_LIMIT - recentRequests.length),
        limit: RATE_LIMIT,
        resetTime: oldestRequest + WINDOW_MS
    };
}

// Clean up old entries every 10 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, requests] of rateLimitStore.entries()) {
        const recentRequests = requests.filter(timestamp => now - timestamp < WINDOW_MS);
        if (recentRequests.length === 0) {
            rateLimitStore.delete(ip);
        } else {
            rateLimitStore.set(ip, recentRequests);
        }
    }
}, 10 * 60 * 1000);
