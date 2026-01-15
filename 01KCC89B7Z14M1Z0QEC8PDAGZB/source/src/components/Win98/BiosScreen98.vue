<script setup lang="ts">
import { computed } from 'vue';
import { widgetSettings } from '../../stores/config';

const emit = defineEmits<{
  (e: 'done'): void;
}>();

const biosDuration = computed(() => {
  const d = widgetSettings.value?.osConfig?.win98?.timings?.bios ?? 3000;
  return `${Number(d)}ms`;
});
</script>

<template>
  <div class="bios-content award" :style="{ '--bios-duration': biosDuration }">
    <div class="bios-header-award">
      <p>Award Modular BIOS v4.51PG</p>
      <p>Copyright (C) 1984-1998, Award Software, Inc.</p>
    </div>
    <br>
    <p>Intel Pentium MMX Processor detected</p>
    <p>Processor Speed: 233 MHz</p>
    <br>
    <p>Memory Test: 131072K</p>

    <!-- BIOS visual progress -->
    <div class="bios-progress">
      <div class="bios-track"><div class="bios-fill" @animationend="() => emit('done')" /></div>
    </div>

    <p>Memory Test: 131072K OK</p>
    <br>
    <p>Award Plug and Play BIOS Extension v1.0A</p>
    <p>Initialize Plug and Play Cards...</p>
    <p>PNP Init Completed</p>
    <br>
    <p>Detecting Primary Master ... WESTERN DIGITAL 4.3GB</p>
    <p>Detecting Primary Slave ... None</p>
    <p>Detecting Secondary Master ... ATAPI CD-ROM 48X</p>
    <p>Detecting Secondary Slave ... None</p>
    <br>
    <p>Verifying DMI Pool Data........</p>
    <br>
    <p class="cursor-blink">_</p>
  </div>
</template>

<style scoped>
/* Focused Award BIOS styles for Windows 98
   - minimal selectors only (award header, flicker, cursor, progress)
   - default --bios-duration is provided and overwritten at runtime
*/

.bios-content {
  --bios-duration: 3000ms; /* default; overwritten via inline style */
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

.bios-header-award {
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
.bios-progress { width: 60%; max-width: 720px; margin: 6px 0; }
.bios-track {
  width: 100%;
  height: 12px;
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