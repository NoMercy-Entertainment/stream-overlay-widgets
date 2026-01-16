<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

import { updateWidgetSettings, widgetId } from '@/stores/config';
import { useWidgetSocket } from './hooks/useWidgetSocket';
import { syncRgb } from './utils';
import { Argument, FeatherEventPayload, FeatherTheftEventPayload, User } from './types/events';

// Initialize WebSocket connection
const socket = useWidgetSocket(widgetId);

function handleSettingsUpdated(newSettings: any) {
  console.log('Received settings update:', newSettings);
  updateWidgetSettings(newSettings);
}

const eventAudio = ref<HTMLAudioElement | null>(null);

const featherImage = ref<HTMLImageElement | null>(null);
const holderImage = ref<HTMLImageElement | null>(null);
const thiefImage = ref<HTMLImageElement | null>(null);

const holder = ref<User | null>(null);
const holderSide = ref<'left' | 'right'>('left');

const RADIUS = 50; // Half of 100px image size
const FEATHER_WIDTH = 50; // Width of feather image
const LEFT_X = RADIUS + FEATHER_WIDTH; // 100px from edge
const RIGHT_X = window.innerWidth - (RADIUS + FEATHER_WIDTH); // 100px from edge

// Event queue
const eventQueue = ref<FeatherTheftEventPayload[]>([]);
const isProcessingEvent = ref(false);

function handleWidgetEvent(eventPayload: Argument<FeatherEventPayload | FeatherTheftEventPayload>) {
  console.log('Received widget event:', eventPayload);

  if (eventPayload.EventType === 'overlay.feather.event') {
    const data = eventPayload.Data;

    if (data.type === 'init' || data.type === 'theft') {
      queueFeatherSteal(data as FeatherTheftEventPayload);
    } else if (eventAudio.value) {
      handleFeatherEvent(data as FeatherEventPayload);
    }
  }

  if (eventPayload.EventType === 'overlay.feather.steal' && eventPayload.Data.type === 'theft') {
    queueFeatherSteal(eventPayload.Data as FeatherTheftEventPayload);
  }
}

function queueFeatherSteal(eventPayload: FeatherTheftEventPayload) {
  eventQueue.value.push(eventPayload);
  processQueue();
}

function processQueue() {
  if (isProcessingEvent.value || eventQueue.value.length === 0) return;

  isProcessingEvent.value = true;
  const event = eventQueue.value.shift();

  if (event) {
    handleFeatherSteal(event);
  }
}

function handleFeatherEvent(eventPayload: FeatherEventPayload) {
  if (!eventAudio.value) return;

  eventAudio.value.src = eventPayload.audio;
  eventAudio.value.volume = 1;
  eventAudio.value.load();
  console.log('Playing started sound:', eventAudio.value.src);

  eventAudio.value.play()
    .then(() => {
      console.log('Started sound played successfully');
    })
    .catch((error) => {
      console.error('Error playing audio:', error);
    });
}

function handleFeatherSteal(eventPayload: FeatherTheftEventPayload) {
  if (!featherImage.value || !holderImage.value || !thiefImage.value) {
    isProcessingEvent.value = false;
    processQueue();
    return;
  }

  const previousHolder = eventPayload.previousHolder;
  const thief = eventPayload.thief;

  console.log('Theft event details:', { previousHolder, thief });

  // First event or no thief - just show the current holder with feather
  if (!holder.value || !thief) {
    const initialHolder = thief ?? previousHolder;
    if (!initialHolder) {
      isProcessingEvent.value = false;
      processQueue();
      return;
    }

    holder.value = initialHolder;
    holderSide.value = 'left';

    holderImage.value.src = initialHolder.image_url;
    holderImage.value.style.color = initialHolder.color;
    holderImage.value.style.left = `${LEFT_X}px`;
    holderImage.value.classList.add('fade-in');
    holderImage.value.style.display = 'block';

    // Position feather at holder
    const idleX = LEFT_X - RADIUS;
    featherImage.value.style.setProperty('--idle-x', `${idleX}px`);
    featherImage.value.style.setProperty('--idle-flip', '1');
    featherImage.value.classList.add('idle');
    featherImage.value.style.display = 'block';

    // Mark as complete and process next event
    isProcessingEvent.value = false;
    processQueue();
    return;
  }

  // Determine positions: holder stays where they are, thief appears on opposite side
  const thiefSide: 'left' | 'right' = holderSide.value === 'left' ? 'right' : 'left';
  const holderX = holderSide.value === 'left' ? LEFT_X : RIGHT_X;
  const thiefX = thiefSide === 'left' ? LEFT_X : RIGHT_X;

  // Position and show the thief (fading in)
  thiefImage.value.src = thief.image_url;
  thiefImage.value.style.color = thief.color;
  thiefImage.value.style.left = `${thiefX}px`;
  thiefImage.value.classList.remove('fade-out');
  thiefImage.value.classList.add('fade-in');
  thiefImage.value.style.display = 'block';

  // Start feather animation from holder to thief
  const direction = thiefSide === 'right' ? 'right' : 'left';
  const startX = holderX + (holderSide.value === 'left' ? -RADIUS : RADIUS);
  const endX = thiefX + (thiefSide === 'left' ? -RADIUS : RADIUS);
  const endFlip = direction === 'right' ? -1 : 1;

  featherImage.value.style.setProperty('--idle-x', `${startX}px`);
  featherImage.value.style.setProperty('--start-x', `${Math.min(startX, endX)}px`);
  featherImage.value.style.setProperty('--end-x', `${Math.max(startX, endX)}px`);
  featherImage.value.style.setProperty('--idle-flip', `${endFlip}`);

  // Reset and start animation
  featherImage.value.style.animation = 'none';
  void featherImage.value.offsetWidth;
  featherImage.value.style.animation = '';

  featherImage.value.classList.remove('left', 'right', 'idle');
  featherImage.value.classList.add(direction);

  // After animation completes (5s)
  setTimeout(() => {
    if (!featherImage.value || !holderImage.value || !thiefImage.value) return;

    // Fade out the previous holder
    holderImage.value.classList.remove('fade-in');
    holderImage.value.classList.add('fade-out');

    // Update feather to idle at new position
    featherImage.value.style.setProperty('--idle-x', `${endX}px`);
    featherImage.value.style.animation = 'none';
    void featherImage.value.offsetWidth;
    featherImage.value.style.animation = '';
    featherImage.value.classList.remove('left', 'right');
    featherImage.value.classList.add('idle');

    // After fade out completes, swap holder and thief references
    setTimeout(() => {
      if (!holderImage.value || !thiefImage.value) return;

      // Hide the old holder
      holderImage.value.style.display = 'none';
      holderImage.value.classList.remove('fade-out');

      // Swap: thief becomes the new holder
      const tempSrc = thiefImage.value.src;
      const tempColor = thiefImage.value.style.color;
      const tempLeft = thiefImage.value.style.left;

      holderImage.value.src = tempSrc;
      holderImage.value.style.color = tempColor;
      holderImage.value.style.left = tempLeft;
      holderImage.value.classList.add('fade-in');
      holderImage.value.style.display = 'block';

      // Hide thief image (it's now represented by holder)
      thiefImage.value.style.display = 'none';
      thiefImage.value.classList.remove('fade-in');

      // Update state
      holder.value = thief;
      holderSide.value = thiefSide;

      // Mark event as complete and process next in queue
      isProcessingEvent.value = false;
      processQueue();
    }, 500); // fade-out duration
  }, 5000); // feather animation duration
}

onMounted(async () => {
  await socket.connect();
  socket.on('SettingsUpdated', handleSettingsUpdated);
  socket.on('Sync', syncRgb);
  socket.on('WidgetEvent', handleWidgetEvent);

  // Widget starts empty - waiting for first theft event
  // Feather and holder will be shown when first event arrives
});

onUnmounted(() => {
  socket.off('SettingsUpdated', handleSettingsUpdated);
  socket.off('Sync', syncRgb);
  socket.off('WidgetEvent', handleWidgetEvent);

  eventAudio.value?.pause();
  eventAudio.value = null;
});


</script>

<template>
  <div class="w-screen h-screen overflow-hidden">

    <img ref="featherImage" class="feather-img"
      src="https://static-cdn.jtvnw.net/custom-reward-images/39863651/29c1ea38-96ff-4548-9bbf-ec0b665344c0/9bdb5006-a9c6-4127-b130-c0780159e3b1/custom-4.png"
      alt="Feather" />
    <img ref="holderImage" class="user-img" alt="Holder" />
    <img ref="thiefImage" class="user-img" alt="Thief" />

  </div>

  <audio ref="eventAudio" preload="auto" />
</template>


<style>
.feather-img {
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 10;
  display: none;
  width: 50px;
  height: auto;
}

/* Idle state - gentle sway at current position */
.feather-img.idle {
  animation-name: featherIdlePosition, featherIdleSway;
  animation-duration: 0.01s, 2.5s;
  animation-timing-function: linear, ease-in-out;
  animation-fill-mode: forwards, none;
  animation-iteration-count: 1, infinite;
  animation-composition: add, add;
}

/* Moving right (left to right) */
.feather-img.right {
  animation-name: featherMove, featherFlip, featherLeafSway;
  animation-duration: 5s, 5s, 1s;
  animation-timing-function: ease-in-out, ease-in-out, ease-in-out;
  animation-fill-mode: forwards, forwards, forwards;
  animation-iteration-count: 1, 1, 5;
  animation-direction: normal, normal, normal;
  animation-composition: add, add, add;
}

/* Moving left (right to left) */
.feather-img.left {
  animation-name: featherMove, featherFlip, featherLeafSway;
  animation-duration: 5s, 5s, 1s;
  animation-timing-function: ease-in-out, ease-in-out, ease-in-out;
  animation-fill-mode: forwards, forwards, forwards;
  animation-iteration-count: 1, 1, 5;
  animation-direction: reverse, reverse, reverse;
  animation-composition: add, add, add;
}

/* Position feather at idle location with correct flip */
@keyframes featherIdlePosition {
  0%, 100% {
    transform: translate(calc(var(--idle-x) - 50%), -20%) scaleX(var(--idle-flip, 1));
  }
}

@keyframes featherMove {
  0% {
    transform: translate(calc(var(--start-x) - 50%), -20%) scaleX(1);
  }

  100% {
    transform: translate(calc(var(--end-x) - 50%), -20%) scaleX(1);
  }
}

@keyframes featherFlip {
  0% {
    transform: scaleX(1);
  }
  15% {
    transform: scaleX(1);
  }
  35% {
    transform: scaleX(-1);
  }
  48% {
    transform: scaleX(-1);
  }
  58% {
    transform: scaleX(1);
  }
  68% {
    transform: scaleX(1);
  }
  80% {
    transform: scaleX(-1);
  }
  100% {
    transform: scaleX(-1);
  }
}

/* Falling leaf sway - tilts and drifts like a real leaf carried by wind */
@keyframes featherLeafSway {
  0% {
    transform: rotate(0deg) translateY(0px);
  }
  25% {
    transform: rotate(-25deg) translateY(-15px);
  }
  75% {
    transform: rotate(25deg) translateY(15px);
  }
  100% {
    transform: rotate(0deg) translateY(0px);
  }
}

/* Idle sway - very gentle wiggle when stationary */
@keyframes featherIdleSway {
  0% {
    transform: rotate(-2deg) translateY(0px);
  }
  50% {
    transform: rotate(2deg) translateY(-2px);
  }
  100% {
    transform: rotate(-2deg) translateY(0px);
  }
}

.user-img {
  position: absolute;
  display: none;
  width: 100px;
  height: 100px;
  border-radius: 100vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  background-color: currentColor;
  border: 8px solid currentColor;
  opacity: 0;
}

.user-img.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.user-img.fade-out {
  animation: fadeOut 0.5s ease-out forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}
</style>