import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Initialize from localStorage if available
const storedKey = browser ? localStorage.getItem('userApiKey') : null;

export const userApiKey = writable(storedKey || '');
export const useUserKey = writable(browser ? localStorage.getItem('useUserKey') === 'true' : false);

// Subscribe to changes and persist to localStorage
if (browser) {
    userApiKey.subscribe(value => {
        if (value) {
            localStorage.setItem('userApiKey', value);
        } else {
            localStorage.removeItem('userApiKey');
        }
    });

    useUserKey.subscribe(value => {
        localStorage.setItem('useUserKey', value.toString());
    });
}

// Helper to get the current API key configuration
export function getApiKeyConfig() {
    let key = '';
    let useOwn = false;

    userApiKey.subscribe(v => key = v)();
    useUserKey.subscribe(v => useOwn = v)();

    return {
        apiKey: useOwn && key ? key : null,
        isUsingUserKey: useOwn && key
    };
}
