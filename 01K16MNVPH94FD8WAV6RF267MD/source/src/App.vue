<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { useWidgetSocket } from './hooks/useWidgetSocket';
import {updateWidgetSettings, widgetId, widgetName} from "@/stores/config";
import {Argument} from "@/types/events";

// Initialize WebSocket connection
const socket = useWidgetSocket(widgetId);

const handleSettingsUpdated = (newSettings: any) => {
  console.log('Received settings update:', newSettings);
  updateWidgetSettings(newSettings);
};

function handleWidgetEvent(eventPayload: Argument) {
  console.log('Received widget event:', eventPayload);

  if (eventPayload.EventType === 'channel.chat.message.tts') {
    handleTtsEvent(eventPayload.Data as TtsEvent);
  }
}

onMounted(async () => {
  await socket.connect();
  socket.on('SettingsUpdated', handleSettingsUpdated);
  socket.on('WidgetEvent', handleWidgetEvent);
});

onMounted(() => {
  socket.off('SettingsUpdated', handleSettingsUpdated);
  socket.off('WidgetEvent', handleWidgetEvent);
});


interface TtsEvent {
	text: string;
	audioBase64: string;
	user?: {
		id: string;
		displayName: string;
	};
}

const audioEnabled = ref<boolean>(true);
const audioQueue = ref<TtsEvent[]>([]);
const isPlaying = ref<boolean>(false);

async function playBase64Audio(base64: string): Promise<void> {
	return new Promise((resolve) => {
		const audio = new Audio(base64);
		audio.onended = () => resolve();
		audio.onerror = () => resolve();
		audio.play();
	});
}

async function processQueue(): Promise<void> {
	if (isPlaying.value || audioQueue.value.length === 0) return;
	isPlaying.value = true;
	while (audioQueue.value.length > 0) {
		const event = audioQueue.value.shift();
		if (event && audioEnabled.value && event.audioBase64) {
			await playBase64Audio(event.audioBase64);
		}
	}
	isPlaying.value = false;
}

function handleTtsEvent(event: TtsEvent): void {
  console.log('Received TTS event:', event);
	if (audioEnabled.value && event.audioBase64) {
		audioQueue.value.push(event);
		processQueue();
	}
}

</script>

<template>
  <div class="widget-container">
  </div>
</template>
