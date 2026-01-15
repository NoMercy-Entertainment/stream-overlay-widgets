<script setup lang="ts">
import { computed } from 'vue';
import { widgetSettings } from '../../stores/config';

const emit = defineEmits<{
  (e: 'done'): void;
}>();

// BIOS duration for Win3.1 (ms) normalized for CSS
const biosDuration = computed(() => {
  const d = widgetSettings.value?.osConfig?.win31?.timings?.bios ?? 3000;
  return `${Number(d)}ms`;
});
</script>

<template>
  <div class="bios-content ami" :style="{ '--bios-duration': biosDuration }">
    <div class="bios-header">
      <p>AMIBIOS (C)1992 American Megatrends Inc.</p>
      <p>BIOS Date: 03/12/92 Ver: 0402</p>
      <p>Processor: 80486DX-33</p>
    </div>
    <br>
    <p>Memory Test: 640K OK</p>
    <p>Extended Memory: 15360K OK</p>
    <br>

    <!-- small BIOS progress bar for Win3.1 to visually match timing -->
    <div class="bios-progress">
      <div class="bios-track"><div class="bios-fill" @animationend="() => emit('done')" /></div>
    </div>

    <br>
    <p>Primary Master : QUANTUM FIREBALL 540MB</p>
    <p>Primary Slave : None</p>
    <p>Secondary Master: CD-ROM DRIVE</p>
    <p>Secondary Slave : None</p>
    <br>
    <p>Verifying DMI Pool Data........</p>
    <p>Boot from CD:</p>
    <br>
    <p class="cursor-blink">_</p>
  </div>
</template>

<style scoped>
/* Focused AMI BIOS (Windows 3.1) styles only
   - uses --bios-duration (ms) from inline style bound to settings
   - minimal selectors: header, flicker, cursor, progress
*/

.bios-content {
  --bios-duration: 3000ms; /* default, overwritten at runtime */
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #0f0;
  font-family: 'Perfect DOS VGA 437', 'Fixedsys', 'Lucida Console', 'Courier New', monospace;
  font-size: 16px;
  line-height: 20px;
  padding: 20px 30px;
  box-sizing: border-box;
  overflow: hidden;
}

.bios-header {
  color: #00ff00;
  border-bottom: 1px solid #00ff00;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.bios-content p {
  margin: 0;
  padding: 0;
  line-height: 20px;
}

/* Flicker effect */
@keyframes flicker {
  0% { opacity: 1; }
  45% { opacity: 0.98; }
  50% { opacity: 0.92; }
  55% { opacity: 0.98; }
  100% { opacity: 1; }
}
.bios-content { animation: flicker 2s infinite steps(2, end); }

/* Cursor blinking */
@keyframes cursorBlink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
.cursor-blink { animation: cursorBlink 0.8s infinite; display: inline-block; }

/* BIOS progress bar that fills over the configured BIOS time */
.bios-progress { width: 40%; max-width: 480px; margin: 8px 0; }
.bios-track {
  width: 100%;
  height: 10px;
  background: #222;
  border: 1px solid #444;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
  overflow: hidden;
}
.bios-fill {
  transform-origin: left center;
  transform: scaleX(0);
  height: 100%;
  background: linear-gradient(90deg,#003366 0%, #0066cc 60%);
  animation-name: biosFill;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-duration: var(--bios-duration);
}
@keyframes biosFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }

/* Text rendering tweaks */
* { -webkit-font-smoothing: none; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeSpeed; }
</style>