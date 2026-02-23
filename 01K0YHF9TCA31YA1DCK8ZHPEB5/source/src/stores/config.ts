import { ref } from 'vue';

// Type definitions matching your chat overlay settings
interface WidgetSettings {
	showNexUp: boolean;
	showNowPlaying: boolean;
	rainbow: boolean;
	baseColor: string;
	width?: number;
	height?: number;
}

// Get settings from injected global variables
function getWidgetSettings(): WidgetSettings {
	if (typeof window !== 'undefined' && window.WIDGET_SETTINGS) {
		return window.WIDGET_SETTINGS as WidgetSettings;
	}

	// Fallback defaults matching your ChatOverlay
	return {
		showNexUp: true,
		showNowPlaying: true,
		rainbow: true,
		baseColor: '#f72264',
		width: 400,
		height: 200,
	};
}

// Reactive settings store
const widgetSettings = ref<WidgetSettings>(getWidgetSettings());

// Function to update settings (for hot-reload via SignalR)
export function updateWidgetSettings(newSettings: Partial<WidgetSettings>) {
	widgetSettings.value = { ...widgetSettings.value, ...newSettings };
}

// Export the entire settings object for direct access
export { widgetSettings };

// Widget metadata from global variables
export const widgetId = typeof window !== 'undefined' ? window.WIDGET_ID || '{{WIDGET_ID}}' : '{{WIDGET_ID}}';
export const widgetName = typeof window !== 'undefined' ? window.WIDGET_NAME || '{{WIDGET_NAME}}' : '{{WIDGET_NAME}}';
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
