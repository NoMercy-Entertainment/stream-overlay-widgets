<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';

import { updateWidgetSettings, widgetId, widgetSettings } from '@/stores/config';
import { useWidgetSocket } from './hooks/useWidgetSocket';
import { Argument, Records } from './types/events';
import Leaderboard from './components/Leaderboard.vue';
import { syncRgb } from './utils';

// Initialize WebSocket connection
const socket = useWidgetSocket(widgetId);

function handleSettingsUpdated(newSettings: any) {
  console.log('Received settings update:', newSettings);
  updateWidgetSettings(newSettings);
}

const timeout = ref<NodeJS.Timeout>();
const cycleInterval = ref<NodeJS.Timeout>();
const records = ref<Records | null>(null);
const currentCardIndex = ref(0);

// Calculate total number of cards
const totalCards = computed(() => {
  if (!records.value) return 0;
  return Object.keys(records.value).length;
});

// Reset and start cycling when records change
watch(records, (newRecords) => {
  currentCardIndex.value = 0;
  if (cycleInterval.value) clearInterval(cycleInterval.value);
  
  if (newRecords && totalCards.value > 1) {
    cycleInterval.value = setInterval(() => {
      currentCardIndex.value = (currentCardIndex.value + 1) % totalCards.value;
    }, 7000); // 1s slide in + 5s wait + 1s slide out
  }
});

function handleWidgetEvent(eventPayload: Argument<Records>) {
  console.log('Received widget event:', eventPayload);

  if (eventPayload.EventType === 'overlay.leaderboard.show') {

    timeout.value = setTimeout(() => {
      records.value = null;
    }, 50000);

    records.value = eventPayload.Data;
  }
}

onMounted(async () => {
  await socket.connect();
  socket.on('SettingsUpdated', handleSettingsUpdated);
  socket.on('WidgetEvent', handleWidgetEvent);
  socket.on('Sync', syncRgb);
});

onMounted(() => {
  return () => {
    socket.off('SettingsUpdated', handleSettingsUpdated);
    socket.off('WidgetEvent', handleWidgetEvent);
    socket.off('Sync', syncRgb);
    if (cycleInterval.value) clearInterval(cycleInterval.value);
  };
});

</script>

<template>
  <div :data-rainbow="widgetSettings.rainbow" class="w-full h-full flex flex-col justify-start items-start overflow-hidden gap-4">
    <h1 v-if="records" class="text-theme-100 font-bold text-2xl m-4">Leaderboard</h1>
    <div class="rounded-lg flex-shrink-0 overflow-hidden" style="min-width: 500px; height: 300px;">
      <Leaderboard :records="records" :currentIndex="currentCardIndex" />
    </div>
  </div>
</template>