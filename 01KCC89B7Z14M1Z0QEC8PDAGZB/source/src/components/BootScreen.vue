<script setup lang="ts">
import BootScreen2k from '@/components/Win2k/BootScreen2k.vue';
import BootScreen10 from '@/components/Win10/BootScreen10.vue';
import BootScreen31 from '@/components/Win31/BootScreen31.vue';
import BootScreen95 from '@/components/Win95/BootScreen95.vue';
import BootScreenXp from '@/components/WinXp/BootScreenXp.vue';
import BootScreen98 from './Win98/BootScreen98.vue';

interface Props {
	percentage: number;
	username: string;
	message: string;
	os: 'win31' | 'win95' | 'win98' | 'win2000' | 'winXp' | 'win10';
}

const props = defineProps<Props>();
</script>

<template>
	<div class="boot-root"
		:class="props.os"
	>
		<!-- ---------------- WINDOWS 3.1 ---------------- -->
		<BootScreen31 v-if="props.os === 'win31'"
			:percentage="props.percentage"
			:username="props.username"
			:message="props.message"
			:os="props.os"
		/>

		<!-- ---------------- WINDOWS 95 ---------------- -->
		<BootScreen95 v-else-if="props.os === 'win95'"
			:percentage="props.percentage"
			:username="props.username"
			:message="props.message"
			:os="props.os"
		/>

		<!-- ---------------- WINDOWS 98 ---------------- -->
		<BootScreen98 v-else-if="props.os === 'win98'"
			:percentage="props.percentage"
			:username="props.username"
			:message="props.message"
			:os="props.os"
		/>

		<!-- ---------------- WINDOWS 2000 ---------------- -->
		<BootScreen2k v-else-if="props.os === 'win2000'"
			:percentage="props.percentage"
			:username="props.username"
			:message="props.message"
			:os="props.os"
		/>

		<!-- ---------------- WINDOWS XP ---------------- -->
		<BootScreenXp v-else-if="props.os === 'winXp'"
			:percentage="props.percentage"
			:username="props.username"
			:message="props.message"
			:os="props.os"
		/>

		<!-- ---------------- WINDOWS 10 ---------------- -->
		<BootScreen10
			v-else-if="props.os === 'win10'"
			:percentage="props.percentage"
			:username="props.username"
			:message="props.message"
			:os="props.os"
		/>
	</div>
</template>

<style scoped>
.boot-root {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	position: fixed;
	top: 0;
	left: 0;
}
</style>
