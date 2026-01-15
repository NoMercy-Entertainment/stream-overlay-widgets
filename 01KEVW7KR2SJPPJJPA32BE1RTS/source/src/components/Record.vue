<script setup lang="ts">
import { PropType } from 'vue';
import { Record } from '@/types/events';
import Marquee from './Marquee.vue';

const props = defineProps({
    recordData: {
        type: Object as PropType<Record>,
        required: true
    }
});

</script>

<template>
    <div class="flex justify-between items-center px-4 py-3 rounded-md bg-black/35 backdrop-blur-sm border border-white/5 text-theme-100">
        <div class="text-lg font-semibold overflow-hidden max-w-[70%]">
            <Marquee :text="recordData.display_name" />
        </div>

        <div class="text-xl font-bold text-theme-200 text-right">
            {{ recordData.count }}
        </div>
    </div>
</template>