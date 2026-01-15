<script setup lang="ts">
// no runtime logic required for this static BIOS screen
</script>

<template>
  <div class="bios-root">
    <div class="bios-content phoenix">
      <div class="bios-header-phoenix">
        <p>PhoenixBIOS 4.0 Release 6.0</p>
        <p>Copyright 1985-2000 Phoenix Technologies Ltd.</p>
        <p>All Rights Reserved</p>
      </div>

      <br />

      <p>CPU: AMD Athlon(tm) 1200MHz</p>
      <p>Speed: 1.20 GHz</p>

      <br />

      <p>Memory Testing: 262,144K</p>
      <p>Memory Test: 262,144K OK</p>

      <br />

      <p>BIOS Date: 08/04/00  Ver: 6.00PG</p>

      <br />

      <p>Detecting IDE Drives ...</p>
      <p>&nbsp;&nbsp;Primary Master  : MAXTOR 6L060J3 60GB</p>
      <p>&nbsp;&nbsp;Primary Slave   : Not Detected</p>
      <p>&nbsp;&nbsp;Secondary Master: SAMSUNG DVD-ROM SD-616T</p>
      <p>&nbsp;&nbsp;Secondary Slave : Not Detected</p>

      <br />

      <p>Boot Sequence: C: A: CDROM</p>
      <p>Verifying DMI Pool Data ........ ok</p>

      <br />

      <p>Press <span class="key">DEL</span> to enter SETUP</p>

      <br />

      <p class="cursor-blink">_</p>
    </div>
  </div>
</template>

<style scoped>
/* Full-screen BIOS background & monospace look (Win2000 era) */
.bios-root {
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

/* Content area with subtle flicker */
.bios-content {
  width: 100%;
  animation: flicker 2s infinite steps(2, end);
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeSpeed;
}

.bios-content p {
  margin: 0;
  padding: 0;
  line-height: 20px;
}

/* Phoenix-specific header */
.phoenix {
  color: #00ff00;
}

.bios-header-phoenix {
  border-bottom: 1px solid #00ff00;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

/* Small visual for DEL key */
.key {
  display: inline-block;
  border: 1px solid #0f0;
  padding: 0 6px;
  margin: 0 4px;
  border-radius: 2px;
  font-weight: 700;
  line-height: 18px;
}

/* Flicker effect */
@keyframes flicker {
  0% { opacity: 1; }
  45% { opacity: 0.98; }
  50% { opacity: 0.92; }
  55% { opacity: 0.98; }
  100% { opacity: 1; }
}

/* Cursor blinking */
@keyframes cursorBlink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.cursor-blink {
  animation: cursorBlink 0.8s infinite;
  display: inline-block;
}
</style>
