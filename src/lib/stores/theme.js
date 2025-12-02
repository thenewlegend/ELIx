import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Available themes
export const THEMES = {
    SYSTEM: 'system',
    LIGHT: 'light',
    DARK: 'dark',
    AMOLED: 'amoled'
};

// Create the store
function createThemeStore() {
    const { subscribe, set } = writable(THEMES.LIGHT);

    return {
        subscribe,
        set: (theme) => {
            if (!browser) return;

            // Save to localStorage
            localStorage.setItem('theme', theme);

            // Apply theme
            applyTheme(theme);

            set(theme);
        },
        init: () => {
            if (!browser) return;

            const savedTheme = localStorage.getItem('theme') || THEMES.LIGHT;
            applyTheme(savedTheme);
            set(savedTheme);

            // Listen for system preference changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                const currentTheme = localStorage.getItem('theme') || THEMES.SYSTEM;
                if (currentTheme === THEMES.SYSTEM) {
                    applyTheme(THEMES.SYSTEM);
                }
            });
        }
    };
}

// Helper to apply the theme
function applyTheme(theme) {
    if (!browser) return;

    const root = document.documentElement;

    if (theme === THEMES.SYSTEM) {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', systemDark ? 'dark' : 'light');
        // Remove attribute if it's just light/dark standard, but we use data-theme for everything now
        // actually, let's just set the resolved theme
    } else {
        root.setAttribute('data-theme', theme);
    }
}

export const theme = createThemeStore();
