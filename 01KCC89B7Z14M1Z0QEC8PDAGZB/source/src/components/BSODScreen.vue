<script setup lang="ts">
import BlueScreen2k from '@/components/Win2k/BlueScreen2k.vue';
import BlueScreen10 from '@/components/Win10/BlueScreen10.vue';
import BlueScreen31 from '@/components/Win31/BlueScreen31.vue';
import BlueScreen95 from '@/components/Win95/BlueScreen95.vue';
import BlueScreenXp from '@/components/WinXp/BlueScreenXp.vue';
import BlueScreen98 from './Win98/BlueScreen98.vue';

interface Props {
	percentage: number;
	username: string;
	message: string;
	os: 'win31' | 'win95' | 'win98' | 'win2000' | 'winXp' | 'win10';
}

const props = defineProps<Props>();
</script>

<template>
	<div class="bsod-root" :class="props.os">
		<BlueScreen31 
			v-if="props.os === 'win31'" 
			:os="props.os" 
			:username="props.username" 
			:message="props.message" 
		/>

		<BlueScreen95 
			v-else-if="props.os === 'win95'" 
			:os="props.os" 
			:username="props.username" 
			:message="props.message" 
		/>

		<BlueScreen98 
			v-else-if="props.os === 'win98'" 
			:os="props.os" 
			:username="props.username" 
			:message="props.message" 
		/>

		<BlueScreen2k 
			v-else-if="props.os === 'win2000'" 
			:os="props.os" 
			:username="props.username" 
			:message="props.message" 
		/>

		<BlueScreenXp 
			v-else-if="props.os === 'winXp'" 
			:os="props.os" 
			:percentage="props.percentage" 
			:username="props.username" 
			:message="props.message" 
		/>

		<BlueScreen10 
			v-else-if="props.os === 'win10'" 
			:os="props.os" 
			:percentage="props.percentage" 
			:username="props.username" 
			:message="props.message" 
		/>
	</div>
</template>

<style scoped>
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
</style>
