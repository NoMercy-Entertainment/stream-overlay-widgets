import type { SpotifyMe } from '@/types/spotify/me';

import type { SpotifyCurrentlyPlaying } from '@/types/spotify/queue';
import type { SpotifyState } from '@/types/spotify/state';
import { computed, ref } from 'vue';

const me = ref<SpotifyMe>(<SpotifyMe>{});
export const spotifyMe = computed(() => me.value);
export function setSpotifyMe(value: SpotifyMe) {
	me.value = value;
}

const state = ref<SpotifyState>(<SpotifyState>{});
export const spotifyState = computed(() => state.value);
export function setSpotifyState(value: SpotifyState) {
	state.value = value;
}

const queue = ref<SpotifyCurrentlyPlaying[]>(<SpotifyCurrentlyPlaying[]>[]);
export const spotifyQueue = computed(() => queue.value);
export function setSpotifyQueue(value: SpotifyCurrentlyPlaying[]) {
	queue.value = value;
}
