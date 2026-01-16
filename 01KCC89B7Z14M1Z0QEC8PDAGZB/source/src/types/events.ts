export interface Argument<T = any> {
	EventType: string;
	Data: T;
	Timestamp: Date;
}

// ---------------- EVENT PAYLOAD ----------------
export interface BSODTriggerPayload {
	user: {
		id: string;
		display_name: string;
	};
	reward: {
		id: string;
		title: string;
	};
	input: string;
	audio: string;
	duration: number;
	os: string;
}