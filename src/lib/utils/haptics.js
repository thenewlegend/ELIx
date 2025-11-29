/**
 * Haptic feedback utility using Vibration API
 * Gracefully degrades if not supported
 */

// Predefined vibration patterns
export const HAPTIC_PATTERNS = {
    light: [5],
    medium: [10],
    heavy: [15],
    success: [10, 50, 10],
    error: [100],
    warning: [50, 25, 50]
};

/**
 * Trigger haptic feedback
 * @param {string|number[]} pattern - Pattern name or custom array
 */
export function vibrate(pattern = 'light') {
    // Check if Vibration API is supported
    if (!('vibrate' in navigator)) {
        return false;
    }

    // Check if user has reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return false;
    }

    try {
        const vibrationPattern = typeof pattern === 'string'
            ? HAPTIC_PATTERNS[pattern] || HAPTIC_PATTERNS.light
            : pattern;

        navigator.vibrate(vibrationPattern);
        return true;
    } catch (error) {
        // Silently fail
        console.debug('Haptic feedback not available:', error);
        return false;
    }
}

// Convenience methods
export const vibrateLight = () => vibrate('light');
export const vibrateMedium = () => vibrate('medium');
export const vibrateHeavy = () => vibrate('heavy');
export const vibrateSuccess = () => vibrate('success');
export const vibrateError = () => vibrate('error');
export const vibrateWarning = () => vibrate('warning');
