<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

let intervalId: number | null = null;
let crazyIntervalId: number | null = null;

function startGlitch() {
  const root = document.getElementById('glitch-root');
  if (!root) return;

  // Base glitch effects - fast and chaotic
  intervalId = window.setInterval(() => {
    const intensity = Math.random();
    const isCrazy = Math.random() > 0.3; // 70% chance of extreme chaos

    if (isCrazy) {
      // CRAZY MODE: Extreme distortion
      root.style.setProperty('--shift-x', `${(Math.random() - 0.5) * 120}px`);
      root.style.setProperty('--shift-y', `${(Math.random() - 0.5) * 120}px`);
      root.style.setProperty('--rgb-split', `${intensity * 25}px`);
      root.style.setProperty('--noise-opacity', `${0.4 + intensity * 0.6}`);
      root.style.setProperty('--scan-opacity', `${0.3 + intensity * 0.4}`);
      root.style.setProperty('--wave-amount', `${intensity * 0.1}`);
      root.style.setProperty('--rotation', `${(Math.random() - 0.5) * 8}deg`);
      root.style.setProperty('--scale', `${0.85 + Math.random() * 0.3}`);
    } else {
      // Normal glitch
      root.style.setProperty('--shift-x', `${(Math.random() - 0.5) * 60}px`);
      root.style.setProperty('--shift-y', `${(Math.random() - 0.5) * 60}px`);
      root.style.setProperty('--rgb-split', `${intensity * 12}px`);
      root.style.setProperty('--noise-opacity', `${0.2 + intensity * 0.4}`);
      root.style.setProperty('--scan-opacity', `${0.1 + intensity * 0.3}`);
      root.style.setProperty('--wave-amount', `${intensity * 0.04}`);
      root.style.setProperty('--rotation', `${(Math.random() - 0.5) * 3}deg`);
      root.style.setProperty('--scale', `${0.95 + Math.random() * 0.1}`);
    }
  }, 80); // Faster updates for more chaos

  // Extra crazy effects - random intervals
  crazyIntervalId = window.setInterval(() => {
    if (Math.random() > 0.5) {
      // Random crazy spike
      root.style.setProperty('--shift-x', `${(Math.random() - 0.5) * 200}px`);
      root.style.setProperty('--shift-y', `${(Math.random() - 0.5) * 200}px`);
      root.style.setProperty('--rgb-split', `${40 + Math.random() * 30}px`);
      root.style.setProperty('--rotation', `${(Math.random() - 0.5) * 15}deg`);
      root.style.setProperty('--scale', `${0.6 + Math.random() * 0.8}`);

      // Reset after a brief moment
      setTimeout(() => {
        root.style.setProperty('--rotation', '0deg');
        root.style.setProperty('--scale', '1');
      }, 100);
    }
  }, 300);
}

onMounted(() => {
  startGlitch();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  if (crazyIntervalId) clearInterval(crazyIntervalId);
});
</script>

<template>
  <div id="glitch-root" class="glitch-root">
    <!-- Multiple noise layers for more chaos -->
    <div class="noise noise-1"></div>
    <div class="noise noise-2"></div>
    <div class="noise noise-3"></div>

    <!-- RGB split layers -->
    <div class="rgb-layer red"></div>
    <div class="rgb-layer green"></div>
    <div class="rgb-layer blue"></div>
    <div class="rgb-layer cyan"></div>
    <div class="rgb-layer magenta"></div>
    <div class="rgb-layer yellow"></div>

    <!-- Multiple scanline layers -->
    <div class="scanlines scanlines-1"></div>
    <div class="scanlines scanlines-2"></div>

    <!-- Blocky corruption effect -->
    <div class="corruption"></div>

    <!-- Screen tear effect -->
    <div class="tear tear-1"></div>
    <div class="tear tear-2"></div>
    <div class="tear tear-3"></div>

    <!-- Distortion overlay -->
    <div class="distortion"></div>

    <!-- Wave distortion overlay -->
    <svg class="wave-filter">
      <filter id="wave">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="80" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>
  </div>
</template>

<style scoped>
.glitch-root {
  position: fixed;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: normal;
  overflow: hidden;
  z-index: 999999;

  --shift-x: 0px;
  --shift-y: 0px;
  --rgb-split: 0px;
  --noise-opacity: 0.3;
  --scan-opacity: 0.2;
  --wave-amount: 0.02;
  --rotation: 0deg;
  --scale: 1;

  transform: rotate(var(--rotation)) scale(var(--scale));
  transition: transform 0.05s ease-out;
}

/* ---------------- MULTI-LAYER NOISE ---------------- */
.noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,\
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>\
      <filter id='noiseFilter'>\
        <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='6'/>\
      </filter>\
      <rect width='200' height='200' filter='url(%23noiseFilter)'/>\
    </svg>");
  mix-blend-mode: overlay;
}

.noise-1 {
  opacity: var(--noise-opacity);
  animation: noiseMove1 0.1s infinite steps(3);
}

.noise-2 {
  opacity: calc(var(--noise-opacity) * 0.7);
  animation: noiseMove2 0.15s infinite steps(2);
  filter: hue-rotate(90deg);
}

.noise-3 {
  opacity: calc(var(--noise-opacity) * 0.5);
  animation: noiseMove3 0.12s infinite steps(4);
  filter: invert(1);
}

@keyframes noiseMove1 {
  0% { transform: translate(0,0); }
  33% { transform: translate(-15px, 10px); }
  66% { transform: translate(20px, -15px); }
  100% { transform: translate(-10px, 5px); }
}

@keyframes noiseMove2 {
  0% { transform: translate(0,0) scale(1.1); }
  50% { transform: translate(10px, -20px) scale(0.9); }
  100% { transform: translate(-5px, 15px) scale(1.05); }
}

@keyframes noiseMove3 {
  0% { transform: translate(0,0) rotate(0deg); }
  25% { transform: translate(-8px, 12px) rotate(2deg); }
  50% { transform: translate(12px, -8px) rotate(-3deg); }
  75% { transform: translate(-15px, -10px) rotate(1deg); }
  100% { transform: translate(5px, 8px) rotate(-2deg); }
}

/* ---------------- ENHANCED RGB SPLIT ---------------- */
.rgb-layer {
  position: absolute;
  inset: 0;
  mix-blend-mode: screen;
  opacity: 0.5;
  filter: blur(2px);
  transform: translate(var(--shift-x), var(--shift-y));
}

.red {
  background: rgba(255, 0, 0, 0.3);
  transform: translate(calc(var(--shift-x) + var(--rgb-split)), var(--shift-y));
  animation: rgbPulse 0.2s infinite alternate;
}

.green {
  background: rgba(0, 255, 0, 0.3);
  transform: translate(calc(var(--shift-x) - var(--rgb-split)), var(--shift-y));
  animation: rgbPulse 0.25s infinite alternate-reverse;
}

.blue {
  background: rgba(0, 0, 255, 0.3);
  transform: translate(var(--shift-x), calc(var(--shift-y) + var(--rgb-split)));
  animation: rgbPulse 0.18s infinite alternate;
}

.cyan {
  background: rgba(0, 255, 255, 0.2);
  transform: translate(calc(var(--shift-x) + var(--rgb-split) * 0.5), calc(var(--shift-y) - var(--rgb-split) * 0.5));
  animation: rgbPulse 0.22s infinite alternate;
}

.magenta {
  background: rgba(255, 0, 255, 0.2);
  transform: translate(calc(var(--shift-x) - var(--rgb-split) * 0.7), calc(var(--shift-y) + var(--rgb-split) * 0.3));
  animation: rgbPulse 0.19s infinite alternate-reverse;
}

.yellow {
  background: rgba(255, 255, 0, 0.2);
  transform: translate(calc(var(--shift-x) * 0.5), calc(var(--shift-y) - var(--rgb-split)));
  animation: rgbPulse 0.21s infinite alternate;
}

@keyframes rgbPulse {
  from { opacity: 0.3; }
  to { opacity: 0.7; }
}

/* ---------------- MULTIPLE SCANLINES ---------------- */
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
      to bottom,
      rgba(0,0,0,0) 0px,
      rgba(0,0,0,0) 2px,
      rgba(0,0,0,0.3) 3px
  );
  opacity: var(--scan-opacity);
}

.scanlines-1 {
  animation: scanMove1 0.2s infinite linear;
}

.scanlines-2 {
  background: repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,0) 0px,
      rgba(255,255,255,0) 3px,
      rgba(255,255,255,0.1) 4px
  );
  animation: scanMove2 0.35s infinite linear reverse;
}

@keyframes scanMove1 {
  from { transform: translateY(0); }
  to { transform: translateY(3px); }
}

@keyframes scanMove2 {
  from { transform: translateY(0); }
  to { transform: translateY(4px); }
}

/* ---------------- BLOCKY CORRUPTION ---------------- */
.corruption {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 50px,
      rgba(255, 0, 0, 0.3) 50px,
      rgba(255, 0, 0, 0.3) 55px,
      transparent 55px,
      transparent 120px,
      rgba(0, 255, 255, 0.3) 120px,
      rgba(0, 255, 255, 0.3) 125px
  );
  animation: corruptionSlide 0.15s infinite steps(5);
  opacity: 0.6;
}

@keyframes corruptionSlide {
  0% { transform: translateX(0); }
  100% { transform: translateX(-150px); }
}

/* ---------------- SCREEN TEAR EFFECTS ---------------- */
.tear {
  position: absolute;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg,
  rgba(255,0,0,0.4),
  rgba(0,255,0,0.4),
  rgba(0,0,255,0.4)
  );
  mix-blend-mode: screen;
}

.tear-1 {
  top: 25%;
  animation: tear1 0.3s infinite steps(3);
}

.tear-2 {
  top: 60%;
  animation: tear2 0.25s infinite steps(4);
}

.tear-3 {
  top: 85%;
  animation: tear3 0.35s infinite steps(2);
}

@keyframes tear1 {
  0% { transform: translateX(0); }
  50% { transform: translateX(-50vw); }
  100% { transform: translateX(30vw); }
}

@keyframes tear2 {
  0% { transform: translateX(0); }
  50% { transform: translateX(60vw); }
  100% { transform: translateX(-40vw); }
}

@keyframes tear3 {
  0% { transform: translateX(0) scaleX(1); }
  50% { transform: translateX(-70vw) scaleX(1.5); }
  100% { transform: translateX(50vw) scaleX(0.8); }
}

/* ---------------- DISTORTION OVERLAY ---------------- */
.distortion {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(255, 0, 255, 0.1) 20%,
      transparent 40%,
      rgba(0, 255, 255, 0.1) 60%,
      transparent 80%,
      rgba(255, 255, 0, 0.1) 100%
  );
  animation: distortionWave 0.4s infinite alternate;
  mix-blend-mode: overlay;
}

@keyframes distortionWave {
  from {
    transform: skewY(2deg) translateY(-10px);
    filter: hue-rotate(0deg);
  }
  to {
    transform: skewY(-2deg) translateY(10px);
    filter: hue-rotate(180deg);
  }
}

/* ---------------- WAVE DISTORTION ---------------- */
.wave-filter {
  position: absolute;
  inset: 0;
  filter: url(#wave);
  opacity: 0.5;
  pointer-events: none;
  animation: waveRotate 0.5s infinite linear;
}

@keyframes waveRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>