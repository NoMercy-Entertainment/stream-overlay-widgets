import type { SpotifyBroadcastEvent } from '@/types/spotify/broadcast';
import type { SpotifyConnectEvent } from '@/types/spotify/connect';
import type { SpotifyLikeEvent } from '@/types/spotify/like';
import type { SpotifyMessageEvent } from '@/types/spotify/state';

export enum SpotifyEventType {
	PLAYER_STATE_CHANGED = 'PLAYER_STATE_CHANGED',
	BROADCAST_UNAVAILABLE = 'BROADCAST_UNAVAILABLE',
	PUT = 'PUT',
}

export type SpotifyEvent = SpotifyConnectEvent | SpotifyBroadcastEvent | SpotifyMessageEvent | SpotifyLikeEvent;

export interface SpotifyGenricEvent<T> {
	headers: SpotifyHeaders;
	payloads: T[];
	type: string;
	uri: string;
}

export interface SpotifyHeaders {
	'content-type': string;
}
