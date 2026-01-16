export interface Argument<T = any> {
	EventType: string;
	Data: T;
	Timestamp: Date;
}

export interface User {
	id: string;
	display_name: string;
	image_url: string;
	color: string;
	coordinates?: { x: number; y: number };
}


export interface FeatherEventPayload {
	type: 'started' | 'ended';
	user: Omit<User, 'image_url'>;
	reward: {
		id: string;
		title: string;
	};
	audio: string;
	duration: number;
}

export interface FeatherTheftEventPayload {
	type: 'theft' | 'init';
	previousHolder: User;
	thief?: User;
	isAvailable?: boolean;
}