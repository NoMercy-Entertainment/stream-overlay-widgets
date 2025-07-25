import type { VNodeRef } from 'vue';
import type { User } from '@/types/twitch';
import { ref } from 'vue';

// Type definitions matching your chat overlay settings
interface WidgetSettings {
	width: number;
	height: number;
	rainbow: boolean;
	badgeTransitionDuration: number;
	badgeOpenDuration: number;
	badgeClosedDuration: number;
	texts: string[];
}

// Get settings from injected global variables
function getWidgetSettings(): WidgetSettings {
	if (typeof window !== 'undefined' && window.WIDGET_SETTINGS) {
		return window.WIDGET_SETTINGS as WidgetSettings;
	}

	// Fallback defaults matching your ChatOverlay
	return {
		width: 700,
		height: 350,
		rainbow: true,
		badgeTransitionDuration: 2,
		badgeOpenDuration: 10,
		badgeClosedDuration: 10,
		texts: [
			'Welcome to the stream!',
			'Enjoy your stay!',
			'Thanks for watching!',
			'Feel free to chat!',
			'Follow for updates!',
			'Join our community!',
		],
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
export const widgetId = typeof window !== 'undefined' ? window.WIDGET_ID || '01K0YVRR8W2BFVKRTBBJA3Z5X0' : '01K0YVRR8W2BFVKRTBBJA3Z5X0';
export const widgetName = typeof window !== 'undefined' ? window.WIDGET_NAME || 'Logo badge' : 'Logo badge';
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

export const latestSubscriber = ref<User>();
export const latestFollower = ref<User>();

export const textQueue: string[] = [];

export const extension = ref<VNodeRef>();
export const badge = ref<VNodeRef>();
export const span = ref<VNodeRef>();

let intercept = false;
let interval: NodeJS.Timeout;
let index = -1;

export function sleep(duration: number) {
	return new Promise(resolve => setTimeout(resolve, duration * 1000));
}

export async function toggle() {
	if (!extension.value || !badge.value || !span.value)
		return;

	setTimeout(() => {
		(extension.value as unknown as HTMLDivElement)!.classList.add('active');
	}, 800);

	(badge.value as unknown as HTMLDivElement).classList.toggle('active');

	await sleep(widgetSettings.value.badgeTransitionDuration);
}

export async function open() {
	if (!extension.value || !badge.value || !span.value)
		return;

	const width = window.getComputedStyle(span.value as unknown as HTMLDivElement).width;
	(extension.value as unknown as HTMLDivElement).style.setProperty('--card-width', `calc(${width})`);

	setTimeout(() => {
		(extension.value as unknown as HTMLDivElement)!.classList.add('active');
	}, 800);

	(badge.value as unknown as HTMLDivElement).classList.add('active');

	await sleep(widgetSettings.value.badgeTransitionDuration);
}

export async function close(skip = false): Promise<void> {
	if (!extension.value || !badge.value || !span.value)
		return;

	return new Promise((resolve): void => {
		// if we have a queue we need to bypass this exit when called from the queue
		// this prevents remaining timeouts from closing when we want it to stay open
		if (intercept && !skip) {
			return resolve();
		}

		setTimeout(() => {
			(extension.value as unknown as HTMLDivElement)!.classList.remove('active');
		}, 800);

		(badge.value as unknown as HTMLDivElement)!.classList.remove('active');

		setTimeout(() => {
			resolve();
		}, widgetSettings.value.badgeTransitionDuration * 1000);
	});
}

export async function cycle() {
	if (!extension.value || !badge.value || !span.value)
		return;

	index += 1;

	(span.value as unknown as HTMLSpanElement).textContent = widgetSettings.value.texts[index % widgetSettings.value.texts.length]!;

	await open();
	await sleep(widgetSettings.value.badgeOpenDuration);
	await close();
}

export async function roulette() {
	interval = setInterval(
		async () => {
			await cycle();
		},
		(widgetSettings.value.badgeOpenDuration + widgetSettings.value.badgeClosedDuration) * 1000 + widgetSettings.value.badgeTransitionDuration * 1000 * 2,
	);

	await cycle();
}

export async function processQueue() {
	if (!extension.value || !badge.value || !span.value)
		return;

	// return to normal rotation when empty
	if (textQueue.length === 0 || intercept) {
		await sleep(widgetSettings.value.badgeClosedDuration);
		await roulette();
		return;
	}

	intercept = true;

	clearInterval(interval);

	await close(intercept);

	(span.value as unknown as HTMLSpanElement).textContent = textQueue.shift()!;

	await open();
	await sleep(widgetSettings.value.badgeOpenDuration);

	intercept = false;

	await close(intercept);

	await processQueue();
}

export async function messageNow(text: string) {
	textQueue.push(text);
	// if we are not already busy with the queue
	if (!intercept) {
		await processQueue();
	}
}

setTimeout(async () => {
	(extension.value as unknown as HTMLDivElement).style.transitionDuration = `${widgetSettings.value.badgeTransitionDuration * 1000}ms`;

	await roulette();
});

setInterval(
	() => {
		latestSubscriber.value && messageNow(`Latest subscriber: ${latestSubscriber.value.display_name}`);
		latestFollower.value && messageNow(`Latest follower: ${latestFollower.value?.display_name}`);
	},
	5 * 60 * 1000,
);
