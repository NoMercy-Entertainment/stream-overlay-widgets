import { ref } from 'vue';

// Type definitions matching your chat overlay settings
interface WidgetSettings {
}

// Get settings from injected global variables
const getWidgetSettings = (): WidgetSettings => {
    if (typeof window !== 'undefined' && window.WIDGET_SETTINGS) {
        return window.WIDGET_SETTINGS as WidgetSettings;
    }

    // Fallback defaults matching your ChatOverlay
    return {
    };
}

// Reactive settings store
const widgetSettings = ref<WidgetSettings>(getWidgetSettings());

// Function to update settings (for hot-reload via SignalR)
export const updateWidgetSettings = (newSettings: Partial<WidgetSettings>) => {
    widgetSettings.value = { ...widgetSettings.value, ...newSettings };
};

// Export the entire settings object for direct access
export { widgetSettings };

// Widget metadata from global variables
export const widgetId = typeof window !== 'undefined' ? window.WIDGET_ID || '01K16MNVPH94FD8WAV6RF267MD' : '01K16MNVPH94FD8WAV6RF267MD';
export const widgetName = typeof window !== 'undefined' ? window.WIDGET_NAME || 'TTS Audio Widget' : 'TTS Audio Widget';
export const widgetVersion = typeof window !== 'undefined' ? window.WIDGET_VERSION || '1.0.0' : '1.0.0';

// Global type declarations
declare global {
    interface Window {
        WIDGET_SETTINGS?: WidgetSettings;
        WIDGET_ID?: string;
        WIDGET_NAME?: string;
        WIDGET_VERSION?: string;
    }
}
