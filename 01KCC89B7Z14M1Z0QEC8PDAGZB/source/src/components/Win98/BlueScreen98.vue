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
	<div class="bsod-root">
		<div class="bsod-content win9x">
			<div class="win9x-header">
				Windows
			</div>

			<div class="win9x-body">
				<pre class="bsod-pre">
An exception 0D has occurred at 0028:80014812 in VxD
CONTOSO(03) + 00000152. This was called from 0028:80014C34 in
VxD CONTOSO(03) + 00000574. It may be possible to continue
normally.

* Press any key to attempt to continue.
* Press CTRL+ALT+DEL to restart your computer. You will
  lose any unsaved information in all applications.

*** SYSTEM DRIVER FAILURE ************************************************
* Faulting driver: "USER_{{ username }}_DRIVER.SYS"
* Exception code: 0xDEADFA11
* Additional info: {{ message }}

				</pre>

				<div class="bsod-footer">
					Press any key to continue _
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* ROOT */
.bsod-root {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	box-sizing: border-box;
	font-family: 'Fixedsys', 'Lucida Console', 'Courier New', monospace;
	overflow: hidden;
}

.bsod-content {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
}

/* ---------------- WINDOWS 95 / 98 ---------------- */
.win9x {
	background: #00279e;
	color: #ffffff;
	font-size: 18px;
	line-height: 26px;
	padding: 0;
}

.win9x-header {
	display: inline-block;
	font-weight: bold;
	font-size: 18px;
	margin: 48px auto 18px auto;
	text-align: center;
	padding: 6px 16px;
	background: #c0c0c0;
	color: #00279e;
	border-radius: 2px;
	box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.02);
}

.win9x-body {
	padding: 36px 80px 60px 80px;
	background: transparent;
	max-width: 1100px;
	margin: 0 auto;
}

.win9x-body p {
	margin: 0;
	padding: 0;
}

.bsod-root {
	width: 100vw;
	height: 100vh;
	background: #00279e;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	box-sizing: border-box;
	font-family: 'Courier New', 'Lucida Console', monospace;
}

.bsod-pre {
	color: #ffffff;
	font-family: 'Courier New', 'Lucida Console', monospace;
	font-size: 18px;
	line-height: 26px;
	white-space: pre-wrap;
	margin: 0;
}

.bsod-footer {
	margin-top: 28px;
	text-align: center;
	color: #ffffff;
	font-weight: 600;
}

/* Text rendering for authenticity */
* {
	-webkit-font-smoothing: none;
	-moz-osx-font-smoothing: grayscale;
	text-rendering: optimizeSpeed;
}
</style>
