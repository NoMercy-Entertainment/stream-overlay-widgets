<script setup>
import Record from './Record.vue';
import { computed } from 'vue';

const props = defineProps({
    records: { type: Object, required: true },
    currentIndex: { type: Number, default: 0 }
});

const categories = computed(() => {
    if (!props.records) return [];
    return Object.keys(props.records);
});

const currentCategory = computed(() => {
    if (categories.value.length === 0) return null;
    return categories.value[props.currentIndex];
});

</script>

<template>
    <div class="relative w-full">
        <transition 
            name="slide-left"
            mode="out-in"
            :css="true"
        >
            <div 
                v-if="currentCategory && records[currentCategory]"
                :key="currentCategory"
                id="card"
                class="relative flex-shrink-0 card rounded-lg backdrop-blur-xl border border-white/5 ml-4 w-[500px] overflow-clip"
            >
                <div id="background" class="absolute rounded-md inset-0 -z-10" />
                
                <div class="relative rounded-lg bg-black/25">
                    <h1 class="text-theme-100 font-bold text-xl pt-4 px-4 mb-4">
                        {{ currentCategory }}
                    </h1>

                    <div class="flex flex-col gap-2 p-4 pt-0">
                        <div v-for="record in records[currentCategory]" :key="record.display_name" class="flex-shrink-0">
                            <Record :recordData="record" />
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.slide-left-enter-active {
    animation: slideIn 1s ease-in-out;
}

.slide-left-leave-active {
    animation: slideOut 1s ease-in-out;
}

@keyframes slideIn {
    0% {
        opacity: 0;
        transform: translateX(0);
    }
    1% {
        transform: translateX(-100%);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOut {
    0% {
        opacity: 1;
        transform: translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-100%);
    }
}
</style>
