<script setup lang="ts">
import type { Argument, Cheer, Follow, GiftSub, Raid, Resub, Sub } from '@/types/events';

import { onMounted } from 'vue';

import Badge from '@/components/Badge.vue';
import { useWidgetSocket } from '@/hooks/useWidgetSocket';

import { messageNow, updateWidgetSettings, widgetId, widgetSettings } from '@/stores/config';

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
});

onMounted(() => {
	socket.off('SettingsUpdated', handleSettingsUpdated);
	socket.off('WidgetEvent', handleWidgetEvent);
});

function handleWidgetEvent(eventPayload: Argument) {
	console.log('Received widget event:', eventPayload);

	if (eventPayload.EventType === 'channel.raid') {
		const data = (eventPayload as Argument<Raid>).Data;

		const eventMessage = `${data.user} just raided with ${data.viewers} viewers!`;
		messageNow(eventMessage);
	}

	if (eventPayload.EventType === 'channel.follow') {
		const data = (eventPayload as Argument<Follow>).Data;

		const eventMessage = `${data.user} just followed!`;
		messageNow(eventMessage);
	}

	if (eventPayload.EventType === 'channel.subscribe') {
		const data = (eventPayload as Argument<Sub>).Data;

		const eventMessage = `${data.user} just subscribed!`;
		messageNow(eventMessage);
	}

	if (eventPayload.EventType === 'channel.subscription.message') {
		const data = (eventPayload as Argument<Resub>).Data;

		const eventMessage = `${data.user} just resubscribed for ${data.months} months!`;
		messageNow(eventMessage);

		data.message && messageNow(data.message);
	}

	if (eventPayload.EventType === 'channel.subscription.gift') {
		const data = (eventPayload as Argument<GiftSub>).Data;

		const eventMessage = `${data.user ?? 'An anonymous gifter'} just gifted ${data.count} subscriptions!`;
		messageNow(eventMessage);
	}

	if (eventPayload.EventType === 'channel.cheer') {
		const data = (eventPayload as Argument<Cheer>).Data;

		const eventMessage = `${data.user ?? 'An anonymous cheerer'} just cheered ${data.bits} bits!`;
		messageNow(eventMessage);

		data.message && messageNow(data.message);
	}
}
</script>

<template>
	<div :data-rainbow="widgetSettings.rainbow" class="w-screen h-screen overflow-hidden flex flex-col p-16 pr-10">
		<Badge />
	</div>
</template>
