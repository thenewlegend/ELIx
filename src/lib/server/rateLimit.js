// In-memory rate limiter for API requests
// Cooldown after exhaustion: 10 queries at any pace, then 15-min cooldown from when limit is hit

const rateLimitStore = new Map(); // Map<ip, { count: number, cooldownStartedAt: number | null }>
const RATE_LIMIT = 10; // queries before cooldown
const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes cooldown

/**
 * Check if an IP address has exceeded the rate limit
 * @param {string} ip - Client IP address
 * @returns {{ allowed: boolean, remaining: number, resetTime: number, limit: number }}
 */
export function checkRateLimit(ip) {
    const now = Date.now();

    // Get or create entry for this IP
    if (!rateLimitStore.has(ip)) {
        rateLimitStore.set(ip, { count: 0, cooldownStartedAt: null });
    }

    const data = rateLimitStore.get(ip);

    // Check if in cooldown period
    if (data.cooldownStartedAt !== null) {
        const cooldownElapsed = now - data.cooldownStartedAt;

        if (cooldownElapsed >= COOLDOWN_MS) {
            // Cooldown expired - reset everything
            data.count = 0;
            data.cooldownStartedAt = null;
        } else {
            // Still in cooldown
            const resetTime = data.cooldownStartedAt + COOLDOWN_MS;
            return {
                allowed: false,
                remaining: 0,
                resetTime,
                limit: RATE_LIMIT
            };
        }
    }

    // Increment count
    data.count++;

    // Check if this request hits the limit
    if (data.count >= RATE_LIMIT) {
        data.cooldownStartedAt = now;
        rateLimitStore.set(ip, data);

        return {
            allowed: true, // This request is allowed (it's the 10th one)
            remaining: 0,
            resetTime: now + COOLDOWN_MS,
            limit: RATE_LIMIT
        };
    }

    rateLimitStore.set(ip, data);

    return {
        allowed: true,
        remaining: RATE_LIMIT - data.count,
        resetTime: now + COOLDOWN_MS, // Estimated, not accurate until limit hit
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
            resetTime: now + COOLDOWN_MS
        };
    }

    const data = rateLimitStore.get(ip);

    // Check if in cooldown
    if (data.cooldownStartedAt !== null) {
        const cooldownElapsed = now - data.cooldownStartedAt;

        if (cooldownElapsed >= COOLDOWN_MS) {
            // Cooldown expired
            return {
                remaining: RATE_LIMIT,
                limit: RATE_LIMIT,
                resetTime: now + COOLDOWN_MS
            };
        } else {
            // Still in cooldown
            return {
                remaining: 0,
                limit: RATE_LIMIT,
                resetTime: data.cooldownStartedAt + COOLDOWN_MS
            };
        }
    }

    return {
        remaining: Math.max(0, RATE_LIMIT - data.count),
        limit: RATE_LIMIT,
        resetTime: now + COOLDOWN_MS // Not accurate until limit is hit
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
