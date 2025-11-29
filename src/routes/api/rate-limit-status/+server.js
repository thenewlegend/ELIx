import { getRateLimitStatus } from '$lib/server/rateLimit.js';
import { getClientIP } from '$lib/server/utils.js'; // Assuming we'll move getClientIP to a shared util

export async function GET({ request }) {
    const clientIP = getClientIP(request);
    const status = getRateLimitStatus(clientIP);

    return new Response(JSON.stringify(status), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        }
    });
}
