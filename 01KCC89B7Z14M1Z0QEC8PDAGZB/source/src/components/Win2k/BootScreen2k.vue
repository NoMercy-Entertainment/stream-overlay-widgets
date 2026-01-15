<script setup lang="ts">
import { computed } from 'vue';
import { widgetSettings } from '../../stores/config';

// Compute the startup duration (in ms) for Windows 2000 from the reactive settings store
const startupDuration = computed(() => {
  const d = widgetSettings.value?.osConfig?.win2000?.timings?.startup;
  const ms = Number(d ?? 1500);
  return `${ms}ms`;
});
</script>

<template>
  <!-- bind a CSS variable so the stylesheet can pick up the configured duration -->
  <div class="boot-content win2k-boot" :style="{ '--startup-duration': startupDuration }">
    <div class="win2k-logo">
      <div class="win2k-window">
        <div class="win2k-pane" />
        <div class="win2k-pane" />
        <div class="win2k-pane" />
        <div class="win2k-pane" />
      </div>
      <div class="win2k-text">
        Microsoft Windows 2000
      </div>
      <div class="win2k-subtext">
        Professional
      </div>
    </div>

    <div class="win2k-loading">
      <div class="win2k-progress">
        <div class="progress-track">
          <div class="progress-fill" />
        </div>
      </div>
      <div class="win2k-status">
        Starting up...
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Minimal, focused styles for Windows 2000 boot screen only
   - removed styles for Win3.1, Win95, Win98, XP, Win10
   - define a default --startup-duration so static analyzers don't error
*/

.win2k-boot {
  --startup-duration: 1500ms; /* default (overwritten at runtime by inline style) */
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff url('../../assets/windows-2k-startup-screen.png') center bottom / 100% auto no-repeat;
  color: #000000;
}

.boot-content {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* keep the DOM logo hidden because the image is the authoritative visual */
.win2k-logo { display: none; }

/* Loading bar container positioned above the footer area like the real screen */
.win2k-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 36px;
  width: 520px;
  max-width: 90%;
}

.progress-track {
  width: 100%;
  height: 14px;
  background: #d9d9d9;
  border: 1px solid #bdbdbd;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
  position: relative;
  overflow: hidden;
}

/* subtle vertical segmentation overlay like the original */
.progress-track::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px);
  background-size: 22px 100%;
}

.progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #003366 0%, #0066cc 60%);
  box-shadow: inset 0 -2px 3px rgba(0,0,0,0.2);
  animation-name: progressFill;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-duration: var(--startup-duration);
}

@keyframes progressFill {
  from { width: 0%; }
  to { width: 100%; }
}

.win2k-status {
  font-family: 'Trebuchet MS', Arial, sans-serif;
  font-size: 14px;
  color: #333333;
}
</style>