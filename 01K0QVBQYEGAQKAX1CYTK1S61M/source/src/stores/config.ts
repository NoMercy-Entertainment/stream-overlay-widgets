import { computed, ref } from 'vue';

// Type definitions matching your chat overlay settings
interface WidgetSettings {
	maxMessages: number;
	chatAnimationDuration: number;
	chatShowDuration: number;
	defaultColor: string;
	width: number;
	height: number;
	features: {
		userBadges: boolean;
		userPronouns: boolean;
		userColors: boolean;
		lightColorDetection: boolean;
		shineEffect: boolean;
		marqueeText: boolean;
		ogPreviews: boolean;
		emoteSupport: boolean;
		whitelistedUsers: boolean;
	};
}

// Get settings from injected global variables
function getWidgetSettings(): WidgetSettings {
	if (typeof window !== 'undefined' && window.WIDGET_SETTINGS) {
		return window.WIDGET_SETTINGS as WidgetSettings;
	}

	// Fallback defaults matching your ChatOverlay
	return {
		maxMessages: 4,
		chatAnimationDuration: 0.75,
		chatShowDuration: 30,
		defaultColor: '#f72264',
		width: 520,
		height: 600,
		features: {
			userBadges: true,
			userPronouns: true,
			userColors: true,
			lightColorDetection: true,
			shineEffect: true,
			marqueeText: true,
			ogPreviews: true,
			emoteSupport: true,
			whitelistedUsers: true,
		},
	};
}

// Reactive settings store
const widgetSettings = ref<WidgetSettings>(getWidgetSettings());

// Computed properties matching your ChatOverlay store/config.ts pattern
export const maxMessages = computed(() => widgetSettings.value.maxMessages ?? 4);
export const chatAnimationDuration = computed(() => widgetSettings.value.chatAnimationDuration ?? 0.75);
export const chatShowDuration = computed(() => widgetSettings.value.chatShowDuration ?? 30);
export const defaultColor = computed(() => widgetSettings.value.defaultColor ?? '#f72264');

// Feature flags
export const features = computed(() => widgetSettings.value.features ?? {});

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
