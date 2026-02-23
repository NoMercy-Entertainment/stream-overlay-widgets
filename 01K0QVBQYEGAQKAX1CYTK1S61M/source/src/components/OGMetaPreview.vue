<script setup lang="ts">
import type { PropType } from 'vue';
import type { OGMetadata } from '@/types/chat';

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
		<div class="og-preview expanded mt-1 border border-white/10 rounded overflow-hidden bg-gray-700 cursor-pointer prose-sm">
			<article class="og-preview-content flex flex-row px-4 gap-2 w-full">
				<div v-if="metadata.image" class="og-preview-image w-1/4 overflow-hidden flex flex-col justify-center items-center">
					<img :src="metadata.image" :alt="metadata.title || 'Link preview'" class="w-full h-[150px] object-contain not-prose rounded-sm">
				</div>
				<div class="og-preview-text p-2 w-available">
					<h3 class="whitespace-nowrap overflow-hidden text-ellipsis mt-0">
						{{ metadata.title || 'No title' }}
					</h3>
					<p v-if="metadata.description" class="overflow-hidden text-ellipsis line-clamp-4 leading-normal">
						{{ metadata.description }}
					</p>
					<small v-if="metadata.host" class="text-white/60">
						{{ metadata.host }}
					</small>
				</div>
			</article>
		</div>
	</template>
</template>

<style scoped>
.og-preview.expanded .og-preview-content {
	max-height: none;
}
</style>
