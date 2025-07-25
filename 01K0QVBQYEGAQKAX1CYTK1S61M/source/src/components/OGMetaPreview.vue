<script setup lang="ts">
import type { PropType } from 'vue';
import type { OGMetadata } from '@/types/chat';
import { defineProps } from 'vue';

const props = defineProps({
	metadata: {
		type: Object as PropType<OGMetadata>,
		required: true,
	},
});
console.log(props.metadata);
</script>

<template>
	<template v-if="metadata">
		<div class="og-preview expanded mt-1 border border-white/10 rounded overflow-hidden bg-gray-700 cursor-pointer">
			<div class="og-preview-content flex flex-col">
				<div v-if="metadata.image" class="og-preview-image w-full overflow-hidden">
					<img :src="metadata.image" :alt="metadata.title || 'Link preview'" class="w-full h-[150px] object-contain">
				</div>
				<div class="og-preview-text p-2">
					<h4 class="m-0 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
						{{ metadata.title || 'No title' }}
					</h4>
					<p v-if="metadata.description" class="m-1 text-xs overflow-hidden text-ellipsis line-clamp-4 leading-normal">
						{{ metadata.description }}
					</p>
					<span v-if="metadata.host" class="text-[11px] text-white/60">
						{{ metadata.host }}
					</span>
				</div>
			</div>
		</div>
	</template>
</template>

<style scoped>
.og-preview.expanded .og-preview-content {
	max-height: none;
}
</style>
