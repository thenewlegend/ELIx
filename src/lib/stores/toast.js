import { writable } from 'svelte/store';

function createToastStore() {
    const { subscribe, update } = writable([]);

    let nextId = 0;

    return {
        subscribe,
        show: (message, type = 'info', duration = 3000) => {
            const id = nextId++;
            const toast = { id, message, type, duration };

            update(toasts => [...toasts, toast]);

            return id;
        },
        dismiss: (id) => {
            update(toasts => toasts.filter(t => t.id !== id));
        },
        clear: () => {
            update(() => []);
        }
    };
}

export const toasts = createToastStore();

// Convenience methods
export const showSuccess = (message, duration) => toasts.show(message, 'success', duration);
export const showError = (message, duration) => toasts.show(message, 'error', duration);
export const showWarning = (message, duration) => toasts.show(message, 'warning', duration);
export const showInfo = (message, duration) => toasts.show(message, 'info', duration);
