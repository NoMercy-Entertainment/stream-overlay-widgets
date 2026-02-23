<script setup lang="ts">
import type { Argument } from '@/types/events';

import type { SpotifyQueue } from '@/types/spotify/queue';
import type { SpotifyState } from '@/types/spotify/state';

import { onMounted, watch } from 'vue';
import NextInQueue from '@/components/NextInQueue.vue';
import NowPlaying from '@/components/NowPlaying.vue';

import { useWidgetSocket } from '@/hooks/useWidgetSocket';
import { updateWidgetSettings, widgetId, widgetSettings } from '@/stores/config';
import { setSpotifyQueue, setSpotifyState, spotifyState } from '@/stores/spotify';
import { syncRgb } from '@/utils';
import serverClient from '@/utils/serverClient';

// Initialize WebSocket connection
const socket = useWidgetSocket(widgetId);

function handleSettingsUpdated(newSettings: any) {
	console.log('Received settings update:', newSettings);
	updateWidgetSettings(newSettings);
}

onMounted(async () => {
	await socket.connect();
	socket.on('SettingsUpdated', handleSettingsUpdated);
	socket.on('WidgetEvent', handleWidgetEvent);
	socket.on('Sync', syncRgb);
});

onMounted(() => {
	socket.off('SettingsUpdated', handleSettingsUpdated);
	socket.off('WidgetEvent', handleWidgetEvent);
	socket.off('Sync', syncRgb);
});

function handleWidgetEvent(eventPayload: Argument) {
	console.log('Received widget event:', eventPayload);

	if (eventPayload.EventType === 'spotify.state.changed') {
		setSpotifyState((eventPayload as Argument<SpotifyState>).Data);
	}

	else if (eventPayload.EventType === 'spotify.track.like') {
		setSpotifyState({
			...spotifyState.value,
			is_liked: (eventPayload as Argument<boolean>).Data,
		});
	}
}

watch(spotifyState, (prevState, newState) => {
	if (prevState.item?.id !== newState.item?.id) {
		console.log('Track changed:', newState.item);

		serverClient()
			.get<SpotifyQueue>('spotify/queue')
			.then(({ data }) => {
				setSpotifyQueue(data.queue);
			});
	}
});
</script>

<template>
	<div 
		:data-rainbow="widgetSettings.rainbow" 
		class="flex flex-col p-16 pr-10 overflow-hidden flex-end"

		:style="{
			width: widgetSettings.width + 'px',
			height: widgetSettings.height + 'px',
		}">
		<NextInQueue v-if="widgetSettings.showNexUp" />
		<NowPlaying v-if="widgetSettings.showNowPlaying" />
	</div>
</template>
