<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	percentage: number;
	username: string;
	message: string;
	os: 'win31' | 'win95' | 'win98' | 'win2000' | 'winXp' | 'win10';
}>();

const username = computed(() => (props.username || 'user'));
</script>

<template>
	<div class="bios-content xp">
		<!-- Logo row -->
		<div class="bios-logo-row" aria-hidden>
			<svg class="bios-logo" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<pattern id="striped-xp" patternUnits="userSpaceOnUse" width="6" height="6">
						<rect width="6" height="3" fill="#c00000" />
					</pattern>
				</defs>

				<!-- triangle -->
				<g transform="translate(0,4)">
					<polygon points="10,72 70,4 130,72" fill="url(#striped-xp)" stroke="#800000" stroke-width="1" />
				</g>

				<!-- text -->
				<g transform="translate(150,28)">
					<text x="0" y="-2" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="#c0c0c0">
						American
					</text>
					<text x="0" y="20" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="#c0c0c0">
						Megatrends
					</text>
				</g>
			</svg>
		</div>

		<!-- BIOS header -->
		<div class="bios-header-xp">
			<p>Phoenix - AwardBIOS v6.00PG</p>
			<p>Copyright (C) 1984-2003, Phoenix Technologies, LTD</p>
			<p>Copyright (C) 1984-2003, Award Software, Inc.</p>
		</div>

		<br>

		<p>Intel(R) Pentium(R) 4 CPU 2.40GHz</p>
		<p>Memory Testing : 1048576K OK</p>

		<br>

		<p>Award Plug and Play BIOS Extension v1.0A</p>
		<p>Initialize Plug and Play Cards...</p>
		<p>PNP Init Completed</p>

		<br>

		<p>Detecting IDE Primary Master : ST380011A</p>
		<p>Detecting IDE Primary Slave : None</p>
		<p>Detecting IDE Secondary Master: LITE-ON DVD SOHD-16P9S</p>
		<p>Detecting IDE Secondary Slave : None</p>

		<br>

		<p>Verifying DMI Pool Data ........</p>
		<p>Boot from CD-ROM :</p>
		<p>Boot from Hard Disk :</p>

		<br>

		<p class="cursor-blink">
			_
		</p>
	</div>
</template>

<style scoped>
.bios-content.xp {
	background: #000;
	color: #c0c0c0;
	font-family: 'Courier New', Courier, monospace;
	font-size: 14px;
	line-height: 1.25;
	padding: 16px;
	width: 100vw;
	height: 100vh;
	box-sizing: border-box;
}

/* Logo */
.bios-logo-row {
	margin-bottom: 12px;
}

.bios-logo {
	width: 260px;
	height: auto;
}

/* Header */
.bios-header-xp p {
	margin: 0;
}

/* Cursor */
.cursor-blink {
	animation: blink 1s steps(1) infinite;
}

@keyframes blink {
	50% {
		opacity: 0;
	}
}
</style>
