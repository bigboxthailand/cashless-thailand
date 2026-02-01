export const toast = {
    success: (message, duration = 3000) => {
        dispatchToast(message, 'success', duration);
    },
    error: (message, duration = 4000) => {
        dispatchToast(message, 'error', duration);
    },
    info: (message, duration = 3000) => {
        dispatchToast(message, 'info', duration);
    },
    warning: (message, duration = 3000) => {
        dispatchToast(message, 'warning', duration);
    }
};

function dispatchToast(message, type, duration) {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-toast', {
            detail: {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                message,
                type,
                duration
            }
        }));
    }
}
