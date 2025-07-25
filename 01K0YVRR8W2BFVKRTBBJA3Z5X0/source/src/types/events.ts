export interface Argument<T = any> {
	EventType: string;
	Data: T;
	Timestamp: Date;
}

export interface Cheer {
	user: string;
	bits: string;
	message?: string;
	isAnonymous?: boolean;
}

export interface Follow {
	user: string;
}

export interface Raid {
	user: string;
	viewers: string;
}

export interface Sub {
	user: string;
	tier: string;
	isGift: string;
}

export interface Resub {
	user: string;
	months: string;
	tier: string;
	streak?: string;
	message?: string;
}

export interface GiftSub {
	user: string;
	count: string;
	tier: string;
	cumulativeTotal?: string;
	isAnonymous?: string;
}
