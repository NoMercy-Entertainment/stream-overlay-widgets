<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	percentage: number;
	username: string;
	message: string;
	os: 'win31' | 'win95' | 'win98' | 'win2000' | 'winXp' | 'win10';
}>();

const username = computed(() => (props.username || 'USER').toUpperCase());
const message = computed(() => (props.message || 'NO_INPUT').toUpperCase());
</script>

<template>
	<div class="bsod-content winxp">
		<p>A problem has been detected and Windows has been shut down to prevent damage</p>
		<p>to your computer.</p>

		<br>

		<p>IRQL_NOT_LESS_OR_EQUAL</p>

		<br>

		<p>If this is the first time you've seen this Stop error screen,</p>
		<p>restart your computer. If this screen appears again, follow</p>
		<p>these steps:</p>

		<br>

		<p>Check to make sure any new hardware or software is properly installed.</p>
		<p>If this is a new installation, ask your hardware or software manufacturer</p>
		<p>for any Windows updates you might need.</p>

		<br>

		<p>If problems continue, disable or remove any newly installed hardware</p>
		<p>or software. Disable BIOS memory options such as caching or shadowing.</p>
		<p>If you need to use Safe Mode to remove or disable components, restart</p>
		<p>your computer, press F8 to select Advanced Startup Options, and then</p>
		<p>select Safe Mode.</p>

		<br>

		<p>Technical information:</p>

		<br>

		<p>*** STOP: 0x000000D1 (0x00000000, 0x00000002, 0x00000000, 0xF86B5A89)</p>

		<br>

		<p>*** {{ username }}_DRIVER.SYS - Address F86B5A89 base at F86B5000, DateStamp 3d6dd67e</p>

		<!-- Funny user input line -->
		<p class="user-input">*** USER_INPUT.SYS - You typed: {{ message }}</p>
	</div>
</template>

<style scoped>
.bsod-content {
	box-sizing: border-box;
	width: 100vw;
	height: 100vh;
	padding: 32px 48px;
	background: #0000aa;
	color: #ffffff;
	font-family: 'Lucida Console', 'Courier New', monospace;
	font-size: 16px;
	line-height: 22px;
}

* {
	-webkit-font-smoothing: none;
	-moz-osx-font-smoothing: grayscale;
	text-rendering: optimizeSpeed;
}

.user-input {
	word-wrap: break-word;
	max-width: 600px;
}
</style>
