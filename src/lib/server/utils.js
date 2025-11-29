/**
 * Get client IP address from request
 * @param {Request} request
 * @returns {string}
 */
export function getClientIP(request) {
    // Check common headers for IP (useful when behind proxy/CDN)
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    // Fallback to a default (for local development)
    return 'unknown';
}
