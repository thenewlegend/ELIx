import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize from localStorage if available
const storedState = browser ? JSON.parse(localStorage.getItem('rateLimitState') || 'null') : null;

const initialState = storedState || {
    remaining: 10,
    limit: 10,
    resetTime: null,
    isVisible: false
};

export const rateLimit = writable(initialState);

// Persist to localStorage
if (browser) {
    rateLimit.subscribe(value => {
        localStorage.setItem('rateLimitState', JSON.stringify(value));
    });
}

export function updateRateLimitFromHeaders(headers) {
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');

    if (limit && remaining) {
        rateLimit.update(s => ({
            ...s,
            limit: parseInt(limit),
            remaining: parseInt(remaining),
            resetTime: reset ? new Date(reset) : null,
            isVisible: true
        }));
    }
}

export async function fetchRateLimitStatus() {
    if (!browser) return;

    try {
        const response = await fetch('/api/rate-limit-status');
        if (response.ok) {
            const status = await response.json();
            rateLimit.update(s => ({
                ...s,
                limit: status.limit,
                remaining: status.remaining,
                resetTime: status.resetTime ? new Date(status.resetTime) : null,
                isVisible: true
            }));
        }
    } catch (e) {
        console.error('Failed to fetch rate limit status', e);
    }
}

export function hideRateLimit() {
    rateLimit.update(s => ({ ...s, isVisible: false }));
}
