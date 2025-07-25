import type { SpotifyImage } from '@/types/spotify/state';

export interface SpotifyMe {
	country: string;
	display_name: string;
	email: string;
	explicit_content: SpotifyExplicitContent;
	external_urls: SpotifyExternalUrls;
	followers: SpotifyFollowers;
	href: string;
	id: string;
	images: SpotifyImage[];
	product: string;
	type: string;
	uri: string;
}

export interface SpotifyExplicitContent {
	filter_enabled: boolean;
	filter_locked: boolean;
}

export interface SpotifyExternalUrls {
	spotify: string;
}

export interface SpotifyFollowers {
	href: null;
	total: number;
}
