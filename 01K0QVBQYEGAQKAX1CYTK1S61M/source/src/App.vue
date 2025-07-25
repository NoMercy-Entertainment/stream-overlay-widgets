<script setup lang="ts">
import { onMounted } from 'vue';

import Chat from './components/Chat.vue';

import { useWidgetSocket } from './hooks/useWidgetSocket';

import {
	updateWidgetSettings,
	widgetId,
} from './stores/config';

const socket = useWidgetSocket(widgetId);

function handleSettingsUpdated(newSettings: any) {
	console.log('Received settings update:', newSettings);
	updateWidgetSettings(newSettings);
}

onMounted(async () => {
	await socket.connect();
	socket.on('SettingsUpdated', handleSettingsUpdated);
});

onMounted(() => {
	socket.off('SettingsUpdated', handleSettingsUpdated);
});
</script>

<template>
	<div class="w-screen h-screen overflow-hidden">
		<Chat v-if="socket.state.isConnected" />
	</div>
</template>
