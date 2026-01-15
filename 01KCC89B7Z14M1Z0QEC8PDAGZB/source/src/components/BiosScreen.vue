<script setup lang="ts">
import BiosScreen2k from '@/components/Win2k/BiosScreen2k.vue';
import BiosScreen10 from '@/components/Win10/BiosScreen10.vue';
import BiosScreen31 from '@/components/Win31/BiosScreen31.vue';
import BiosScreen95 from '@/components/Win95/BiosScreen95.vue';
import BiosScreen98 from '@/components/Win98/BiosScreen98.vue';
import BiosScreenXp from '@/components/WinXp/BiosScreenXp.vue';

interface Props {
	os: 'win31' | 'win95' | 'win98' | 'win2000' | 'winXp' | 'win10';
}

const props = defineProps<Props>();
</script>

<template>
	<div class="bios-root">
		<!-- ---------------- WINDOWS 3.1 (AMI BIOS) ---------------- -->
		<BiosScreen31 v-if="props.os === 'win31'" />

		<!-- ---------------- WINDOWS 95 / 98 (AWARD BIOS) ---------------- -->
		<BiosScreen95 v-else-if="props.os === 'win95'" />

		<BiosScreen98 v-else-if="props.os === 'win98'" />

		<!-- ---------------- WINDOWS 2000 (PHOENIX BIOS) ---------------- -->
		<BiosScreen2k v-else-if="props.os === 'win2000'" />

		<!-- ---------------- WINDOWS XP (PHOENIX/AWARD HYBRID) ---------------- -->
		<BiosScreenXp v-else-if="props.os === 'winXp'" />

		<!-- ---------------- WINDOWS 10 (UEFI BOOT) ---------------- -->
		<BiosScreen10 v-else-if="props.os === 'win10'" />
	</div>
</template>

<style scoped>
.bios-root {
	width: 100vw;
	height: 100vh;
	background: #000;
	color: #0f0;
	font-family: 'Perfect DOS VGA 437', 'Fixedsys', 'Lucida Console', 'Courier New', monospace;
	font-size: 16px;
	line-height: 20px;
	display: flex;
	padding: 20px 30px;
	box-sizing: border-box;
	overflow: hidden;
}
</style>
