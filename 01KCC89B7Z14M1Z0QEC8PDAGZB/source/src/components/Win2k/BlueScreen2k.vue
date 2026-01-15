<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  username?: string;
  message?: string;
}>();

const username = computed(() => (props.username || 'USER').toUpperCase());
const message = computed(() => props.message || 'DRIVER_FAULT');
</script>

<template>
  <div class="bsod-content win2000">
    <p class="win2k-title">*** STOP: 0x0000001E (0xC0000005, 0x{{ username.slice(0, 8) }},
      0x00000000, 0x00000000)</p>
    <p>KMODE_EXCEPTION_NOT_HANDLED</p>
    <p>&nbsp;</p>
    <p>*** Address {{ username }}_DRIVER+1E36 base at C0011000, DateStamp 3d6dd67e</p>
    <p>&nbsp;</p>
    <p>User input: {{ message }}</p>
    <p>&nbsp;</p>
    <p>If this is the first time you've seen this Stop error screen,</p>
    <p>restart your computer. If this screen appears again, follow</p>
    <p>these steps:</p>
    <p>&nbsp;</p>
    <p>Check to make sure any new hardware or software is properly installed.</p>
    <p>If this is a new installation, ask your hardware or software manufacturer</p>
    <p>for any Windows 2000 updates you might need.</p>
    <p>&nbsp;</p>
    <p>If problems continue, disable or remove any newly installed hardware</p>
    <p>or software. Disable BIOS memory options such as caching or shadowing.</p>
    <p>If you need to use Safe Mode to remove or disable components, restart</p>
    <p>your computer, press F8 to select Advanced Startup Options, and then</p>
    <p>select Safe Mode.</p>
    <p>&nbsp;</p>
    <p>Technical information:</p>
    <p>&nbsp;</p>
    <p>*** STOP: 0x0000001E (0xC0000005, 0x00000000, 0x00000000, 0x00000000)</p>
  </div>
</template>

<style scoped>
/* Focused styles for Windows 2000 Blue Screen of Death
   - Removed unused styles for Win3.1, Win9x, XP, and Win10
   - Provide full-screen, monospace rendering and correct colors
*/

.bsod-content {
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  padding: 28px 40px;
  margin: 0;
  background: #0000aa; /* Win2k BSOD blue */
  color: #ffffff;
  font-family: 'Lucida Console', 'Courier New', monospace;
  font-size: 16px;
  line-height: 22px;
  white-space: pre-wrap;
}

/* Title line styling used by the template */
.win2k-title {
  font-weight: bold;
  color: #ffffff;
  background: transparent;
  padding: 8px 0;
  margin-bottom: 6px;
}

/* General paragraph reset to match original layout */
.win2000 p,
.bsod-content p {
  margin: 0 0 6px 0;
  padding: 0;
}

/* Subtle text rendering for authenticity */
* {
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeSpeed;
}
</style>