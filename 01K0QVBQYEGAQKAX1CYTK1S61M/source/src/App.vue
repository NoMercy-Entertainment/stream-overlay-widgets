<script setup lang="ts">
import { onMounted } from 'vue';

import { syncRgb } from '@/utils';

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
	socket.on('Sync', syncRgb);
});

onMounted(() => {
	socket.off('SettingsUpdated', handleSettingsUpdated);
	socket.off('Sync', syncRgb);
});
</script>

<template>
	<div class="w-screen h-screen overflow-hidden">
		<Chat v-if="socket.state.isConnected" />
	</div>
</template>
