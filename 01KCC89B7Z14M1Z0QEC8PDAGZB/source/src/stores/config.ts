import { ref } from 'vue';

export interface WidgetSettings {
	duration: number;
	osConfig: OSConfigs;
}

export interface OSConfigs {
	win31: OSConfig;
	win95: OSConfig;
	win98: OSConfig;
	win2000: OSConfig;
	winXp: OSConfig;
	win10: OSConfig;
}

export interface OSConfig {
	enabled: boolean;
	timings: {
		glitch: number;
		black: number;
		bsod: number;
		bios: number;
		startup: number;
	};
}

// Get settings from injected global variables
function getWidgetSettings(): WidgetSettings {
	if (typeof window !== 'undefined' && window.WIDGET_SETTINGS) {
		return window.WIDGET_SETTINGS as WidgetSettings;
	}

	// Fallback defaults matching your ChatOverlay
	return {
		duration: 25000,
		osConfig: {
			win31: {
				enabled: true,
				timings: {
					glitch: 1500,
					black: 500,
					bsod: 10000,
					bios: 3000,
					startup: 1500
				}
			},
			win95: { enabled: true, timings: { glitch: 1500, black: 500, bsod: 10000, bios: 3000, startup: 1500 }},
			win98: { enabled: true, timings: { glitch: 1500, black: 500, bsod: 10000, bios: 3000, startup: 1500 }},
			win2000: { enabled: true, timings: { glitch: 1500, black: 500, bsod: 10000, bios: 3000, startup: 1500 }},
			winXp: { enabled: true, timings: { glitch: 1500, black: 500, bsod: 10000, bios: 3000, startup: 1500 }},
			win10: { enabled: true, timings: { glitch: 1500, black: 500, bsod: 10000, bios: 3000, startup: 1500 }}
		}
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
export const widgetId = typeof window !== 'undefined' ? window.WIDGET_ID || '01KCC89B7Z14M1Z0QEC8PDAGZB' : '01KCC89B7Z14M1Z0QEC8PDAGZB';
export const widgetName = typeof window !== 'undefined' ? window.WIDGET_NAME || 'BSOD' : 'BSOD';
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
