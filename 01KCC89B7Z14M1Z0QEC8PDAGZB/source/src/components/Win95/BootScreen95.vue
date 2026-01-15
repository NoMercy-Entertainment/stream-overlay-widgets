<script setup lang="ts">

</script>

<template>
  <div class="win95-boot-root">
    <div class="win95-bg" />
    <div class="win95-boot-root">
      <div class="win95-bg" />
      <div class="win95-content">
        <div class="win95-loading">
          <div class="loading-bar-98">
            <div class="loading-fill-98" />
          </div>
        </div>
      </div>
      <div class="win95-gradient-banner" />
    </div>
  </div>
</template>

<style scoped>
.win95-boot-root {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
.win95-bg {
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: url('@/assets/windows-95-startup-screen.png') center center no-repeat;
  background-size: cover;
  z-index: 0;
}
.win95-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  z-index: 2;
  pointer-events: none;
}
.win95-logo {
  margin-bottom: 32px;
}
.win95-window {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 140px;
  height: 140px;
  transform: perspective(400px) rotateY(-15deg);
  margin-bottom: 18px;
}
.win95-pane {
  background: linear-gradient(135deg, #ff0000 0%, #ffff00 50%, #00ff00 100%);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
}
.win95-text {
  font-family: Arial, sans-serif;
  font-size: 42px;
  font-weight: bold;
  color: #fff;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.4);
  text-align: center;
}
.win95-loading {
  width: 450px;
  margin-bottom: 60px;
}
.loading-bar-98 {
  height: 32px;
  background: #c0c0c0;
  border: 3px solid #fff;
  box-shadow:
      inset -2px -2px 0 #808080,
      inset 2px 2px 0 #000;
  overflow: hidden;
}
.loading-fill-98 {
  height: 100%;
  background: linear-gradient(90deg, #000080, #0000ff, #000080);
  background-size: 200% 100%;
  animation: loading98 2.5s infinite;
  width: 0;
}
@keyframes loading98 {
  0% {
    width: 0;
    background-position: 0% 0%;
  }
  50% {
    width: 75%;
    background-position: 100% 0%;
  }
  100% {
    width: 100%;
    background-position: 0% 0%;
  }
}
.win95-gradient-banner {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 90px;
  background: linear-gradient(to top, #000 80%, transparent 100%);
  opacity: 0.7;
  z-index: 3;
  pointer-events: none;
}
</style>
