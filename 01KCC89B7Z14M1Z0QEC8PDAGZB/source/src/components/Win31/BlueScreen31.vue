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
  <div class="bsod-content win31">
    <div class="win31-box">
      <div class="win31-title">Windows</div>
      <div class="win31-body">
        <p>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) +</p>
        <p>00010E36 called from 0028:C0011E36 in VXD {{ username }}(04) +</p>
        <p>00010E36. The current application will be terminated.</p>
        <p>&nbsp;</p>
        <p>* Press any key to terminate the current application.</p>
        <p>* Press CTRL+ALT+DEL again to restart your computer. You will</p>
        <p> lose any unsaved information in all applications.</p>
        <p>&nbsp;</p>
        <p>Error details: {{ message }}</p>
        <p>&nbsp;</p>
        <p style="text-align: center;">Press any key to continue _</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Focused Windows 3.1 error dialog styles
   - Removed unused styles for other OSes
   - Center the dialog on classic Windows 3.1 navy background
   - Use era-appropriate sizing and spacing
*/

.bsod-content {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000080; /* classic Windows 3.1 blue */
  color: #ffffff;
  box-sizing: border-box;
  overflow: hidden;
}

/* Dialog box */
.win31-box {
  background: #c0c0c0; /* light gray dialog */
  border: 2px solid #ffffff; /* white raised edge */
  box-shadow: 2px 2px 0 #000000; /* drop shadow to simulate window border */
  max-width: 640px;
  width: calc(100% - 40px);
  margin: 0 20px;
}

/* Title bar */
.win31-title {
  background: #000080;
  color: #ffffff;
  padding: 6px 10px;
  font-weight: bold;
  font-family: 'MS Sans Serif', 'Tahoma', Arial, sans-serif;
  font-size: 14px;
  border-bottom: 2px solid #000000;
}

/* Body text */
.win31-body {
  background: #c0c0c0;
  color: #000000;
  padding: 14px;
  font-family: 'MS Sans Serif', 'Tahoma', Arial, sans-serif;
  font-size: 13px;
  line-height: 18px;
}

.win31-body p { margin: 0 0 6px 0; }

/* Tweak for the centered prompt */
.win31-body p[style] { margin-top: 8px; }

/* Keep text rendering crisp for small UI fonts */
* { -webkit-font-smoothing: none; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeSpeed; }
</style>