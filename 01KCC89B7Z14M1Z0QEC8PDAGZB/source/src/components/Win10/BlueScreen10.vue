<script setup lang="ts">
import { computed } from 'vue';
import qr from '@/assets/qr.svg';

const props = defineProps<{
	username?: string;
	message?: string;
	percentage?: number;
	stopCode?: string;
}>();

const username = computed(() => (props.username || 'USER').toUpperCase());
const message = computed(() => props.message || 'A_DRIVER_HAS_ISSUES');
const percentage = computed(() => Math.min(Math.max(props.percentage ?? 0, 0), 100));
const stopCode = computed(() => props.stopCode || 'CRITICAL_PROCESS_DIED');
</script>

<template>
	<div id="bsod-screen">
		<div id="container">
			<h1>:(</h1>
			<h2>
				Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll
				restart for you.
			</h2>
			<h2 class="percentage">
				<span>{{ percentage }}</span>% complete
			</h2>
			<div id="details">
				<div id="qr">
					<div id="image">
						<img :src="qr" alt="">
					</div>
				</div>
				<div id="stopcode">
					<h4>
						For more information about this issue and possible fixes, visit:
						<br>
						https://nomercy.tv/stopcode
					</h4>

					<h5>
						If you call a support person, give them this info:
						<br>Stop code: {{ stopCode }}
					</h5>

					<h5 v-if="username" class="failed-driver">
						What failed: {{ username.toLowerCase() }}_driver.sys
					</h5>

					<h5 v-if="message" class="user-input">
						Additional info: {{ message }}
					</h5>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
#bsod-screen {
	width: 100vw;
	height: 100vh;
	background: #0078d7; /* Windows 10 blue */
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
	color: #ffffff;
}

#container {
	display: table-cell;
	vertical-align: middle;
}

h1,
h2,
h3,
h4,
h5 {
	font-weight: normal;
	padding: 0;
	margin: 5px 0;
	margin-top: 0;
	font-weight: 300;
}

h1 {
	font-size: 6.5em;
	margin-bottom: 10px;
}

h2 {
	font-size: 1.5em;
}

h4 {
	font-size: 1.4em;
	line-height: 1.5em;
}

h5 {
	line-height: 1.1em;
	font-size: 1.3em;
}

h5.failed-driver,
h5.user-input {
	font-weight: 400;
	opacity: 0.95;
	word-wrap: break-word;
	max-width: 600px;
}

#details {
	display: flex;
	flex-flow: row;
	flex-wrap: nowrap;
	padding-top: 10px;
}

#qr {
	flex: 0 1 auto;
}

#image {
	background: white;
	padding: 5px;
	line-height: 0;
}

#image img {
	width: 10.5em;
	height: 10.5em;
}

#stopcode {
	padding-left: 10px;
	flex: 1 1 auto;
	text-align: left;
}

@media (min-width: 840px) {
	#page {
		font-size: 140%;
		width: 800px;
	}
}
</style>
