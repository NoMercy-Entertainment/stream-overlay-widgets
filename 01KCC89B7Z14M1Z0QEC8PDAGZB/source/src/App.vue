<script setup lang="ts">
import type { OSConfig, OSConfigs } from '@/stores/config';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { updateWidgetSettings, widgetId, widgetSettings } from '@/stores/config';
import BiosScreen from './components/BiosScreen.vue';

import BootScreen from './components/BootScreen.vue';
import BSODScreen from './components/BSODScreen.vue';
import GlitchLayer from './components/GlitchLayer.vue';
import { useWidgetSocket } from './hooks/useWidgetSocket';
import sounds from './stores/sounds';
import { Argument, BSODTriggerPayload } from './types/events';

// ---------------- OS SELECTION ----------------
const os = ref<'win31' | 'win95' | 'win98' | 'win2000' | 'winXp' | 'win10'>('winXp');
const osList = computed(() => {
	const cfg: OSConfigs = widgetSettings.value.osConfig || {};
	return Object.keys(sounds).filter(os => cfg[os as keyof OSConfigs]?.enabled !== false) as typeof os.value[];
});

function pickRandomOS() {
	const list = osList.value;
	return list[Math.floor(Math.random() * list.length)];
}

function normalizeOS(input: string | undefined): typeof os.value | null {
	if (!input)
		return null;
	const key = input.toLowerCase();

	const map: Record<string, typeof os.value> = {
		'31': 'win31',
		'3.1': 'win31',
		'win3.1': 'win31',
		'win31': 'win31',

		'95': 'win95',
		'win95': 'win95',

		'98': 'win98',
		'win98': 'win98',

		'2000': 'win2000',
		'2k': 'win2000',
		'win2000': 'win2000',

		'xp': 'winXp',
		'winxp': 'winXp',

		'10': 'win10',
		'win10': 'win10',
		'vista': 'win10',
	};

	return map[key] ?? null;
}

// ---------------- SOCKET SETUP ----------------
const socket = useWidgetSocket(widgetId);

function handleSettingsUpdated(newSettings: any) {
	updateWidgetSettings(newSettings);
}

// ---------------- STATE MACHINE ----------------
type BSODState = 'idle' | 'glitch' | 'black' | 'bsod' | 'bios' | 'boot';

const state = ref<BSODState>('idle');
const isActive = ref(false);

// BSOD details
const percentage = ref(0);
const message = ref('');
const username = ref('');

// Audio
const ttsAudio = ref<HTMLAudioElement | null>(null);
const startupAudio = ref<HTMLAudioElement | null>(null);
const ttsSrc = ref<string | null>(null);
const startupSrc = ref<string | null>(null);

// Audio duration tracking
const ttsAudioDuration = ref<number>(0);

// Timers
let percentageIntervalId: number | null = null;
let sequenceTimeouts: number[] = [];

// ---------------- HELPERS ----------------
function clearAllTimeouts() {
	sequenceTimeouts.forEach(id => clearTimeout(id));
	sequenceTimeouts = [];
}

function clearPercentageInterval() {
	if (percentageIntervalId !== null) {
		clearInterval(percentageIntervalId);
		percentageIntervalId = null;
	}
}

function resetState() {
	clearAllTimeouts();
	clearPercentageInterval();

	state.value = 'idle';
	isActive.value = false;

	percentage.value = 0;
	message.value = '';
	username.value = '';

	ttsSrc.value = null;
	startupSrc.value = null;
	ttsAudioDuration.value = 0;
}

// ---------------- BSOD PERCENTAGE ----------------
function startPercentageAnimation(durationMs: number) {
	clearPercentageInterval();
	percentage.value = 0;

	const startTime = Date.now();

	const update = () => {
		const elapsed = Date.now() - startTime;
		const progress = Math.min(elapsed / durationMs, 1);

		if (progress >= 1) {
			percentage.value = 100;
			clearPercentageInterval();
			return;
		}

		const target = Math.floor(progress * 100);
		const increment = Math.floor(Math.random() * 6) + 3;
		percentage.value = Math.min(percentage.value + increment, target);
	};

	percentageIntervalId = window.setInterval(update, 200);
}

// ---------------- MAIN HANDLER ----------------
function handleBSODTrigger(payload: BSODTriggerPayload) {
	username.value = payload.user?.display_name || 'UNKNOWN_USER';
	message.value = payload.input || '';
	ttsSrc.value = payload.audio;

	console.log('BSOD Trigger received:', {
		username: username.value,
		message: message.value,
		hasAudio: !!ttsSrc.value,
		audioLength: ttsSrc.value?.length,
	});

	const chosen = normalizeOS(payload.os);
	os.value = chosen ?? pickRandomOS();

	const cfg = widgetSettings.value.osConfig?.[os.value];

	const timings = cfg?.timings || {
		glitch: 2000,
		black: 800,
		bsod: payload.duration,
		bios: 3000,
		boot: 4500,
		startup: 0,
	};

	// OS-specific startup sound
	startupSrc.value = sounds[os.value].on;

	isActive.value = true;

	// Load TTS audio and detect duration
	if (ttsAudio.value && ttsSrc.value) {
		console.log('Setting TTS audio source...');
		ttsAudio.value.src = ttsSrc.value;
		ttsAudio.value.load(); // Force load

		const handleMetadata = () => {
			if (ttsAudio.value) {
				ttsAudioDuration.value = ttsAudio.value.duration * 1000; // Convert to ms
				console.log(`TTS duration detected: ${ttsAudioDuration.value}ms`);

				// Adjust BSOD timing if TTS is longer than configured duration
				const minBsodDuration = Math.max(timings.bsod, ttsAudioDuration.value + 1000); // +1s buffer

				// Start sequence with adjusted timing
				executeSequence(timings, minBsodDuration);
			}
		};

		const handleError = (e: Event) => {
			console.error('TTS audio load error:', e);
			console.error('Audio src length:', ttsSrc.value?.length);
			// Proceed with default timing even if audio fails
			executeSequence(timings, timings.bsod);
		};

		const handleCanPlay = () => {
			console.log('TTS audio can play, ready state:', ttsAudio.value?.readyState);
		};

		ttsAudio.value.addEventListener('loadedmetadata', handleMetadata, { once: true });
		ttsAudio.value.addEventListener('error', handleError, { once: true });
		ttsAudio.value.addEventListener('canplay', handleCanPlay, { once: true });
	}
	else {
		console.warn('No TTS audio or audio element not ready');
		// No TTS, use default timings
		executeSequence(timings, timings.bsod);
	}
}

function executeSequence(timings: any, bsodDuration: number) {
	// ---- Sequence ----
	state.value = 'glitch';

	sequenceTimeouts.push(
		window.setTimeout(() => {
			state.value = 'black';
		}, timings.glitch),
	);

	sequenceTimeouts.push(
		window.setTimeout(() => {
			state.value = 'bsod';
			startPercentageAnimation(bsodDuration);

			// Play TTS audio
			if (ttsAudio.value && ttsSrc.value) {
				ttsAudio.value.currentTime = 0;
				ttsAudio.value.volume = 1.0; // Ensure volume is at max

				const playPromise = ttsAudio.value.play();
				if (playPromise !== undefined) {
					playPromise
						.catch((error) => {
							console.error('❌ Failed to play TTS audio:', error);
							console.error('Error name:', error.name);
							console.error('Error message:', error.message);
							console.error('Audio ready state:', ttsAudio.value?.readyState);
							console.error('Audio network state:', ttsAudio.value?.networkState);
							// Try again after a brief delay
							setTimeout(() => {
								if (ttsAudio.value) {
									ttsAudio.value.play().catch(e => console.error('Retry failed:', e));
								}
							}, 100);
						});
				}
			}
			else {
				console.warn('Cannot play TTS: audio element or source missing');
			}
		}, timings.glitch + timings.black),
	);

	sequenceTimeouts.push(
		window.setTimeout(() => {
			state.value = 'bios';
		}, timings.glitch + timings.black + bsodDuration),
	);

	sequenceTimeouts.push(
		window.setTimeout(() => {
			state.value = 'boot';
			// Boot screen duration
			const bootScreenDuration = timings.boot || 4500;
			setTimeout(() => {
				state.value = 'idle'; // triggers watcher
			}, bootScreenDuration);
		}, timings.glitch + timings.black + bsodDuration + timings.bios),
	);
}

watch(state, (newState, oldState) => {
	if (oldState === 'boot' && newState !== 'boot') {
		// Boot screen just disappeared
		if (!startupAudio.value || !startupSrc.value) {
			resetState();
			return;
		}

		console.log('Boot screen gone, starting startup audio...');
		startupAudio.value.src = startupSrc.value;
		startupAudio.value.currentTime = 0;
		startupAudio.value.volume = 1.0;
		startupAudio.value.load();

		startupAudio.value
			.play()
			.then(() => {
				console.log('✅ Startup audio playing after boot screen');
				startupAudio.value?.addEventListener(
					'ended',
					() => resetState(),
					{ once: true },
				);
			})
			.catch((err) => {
				console.error('❌ Startup audio failed:', err);
				resetState();
			});
	}
});

// ---------------- SOCKET EVENT ----------------
function handleWidgetEvent(eventPayload: Argument<BSODTriggerPayload>) {
	if (eventPayload.EventType === 'bsod.trigger') {
		handleBSODTrigger(eventPayload.Data);
	}
}

// ---------------- LIFECYCLE ----------------
onMounted(async () => {
	await socket.connect();
	socket.on('SettingsUpdated', handleSettingsUpdated);
	socket.on('WidgetEvent', handleWidgetEvent);
});

onUnmounted(() => {
	socket.off('SettingsUpdated', handleSettingsUpdated);
	socket.off('WidgetEvent', handleWidgetEvent);
	resetState();
});

window.handleBSODTrigger = handleBSODTrigger;
</script>

<template>
	<div v-if="isActive" id="overlay-root">
		<GlitchLayer v-if="state === 'glitch'" />

		<div v-else-if="state === 'black'" class="black-screen" />

		<BSODScreen
			v-else-if="state === 'bsod'"
			:percentage="percentage"
			:username="username"
			:message="message"
			:os="os"
		/>

		<BiosScreen v-else-if="state === 'bios'"
			:percentage="percentage"
			:username="username"
			:message="message"
			:os="os"
		/>

		<BootScreen v-else-if="state === 'boot'"
			:percentage="percentage"
			:username="username"
			:message="message"
			:os="os"
		/>
	</div>
	<audio ref="ttsAudio" preload="auto" />
	<audio ref="startupAudio" preload="auto" />
</template>

<style scoped>
#overlay-root {
	position: fixed;
	inset: 0;
	z-index: 999999;
	pointer-events: none;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.black-screen {
	width: 100vw;
	height: 100vh;
	background: #000;
}
</style>
