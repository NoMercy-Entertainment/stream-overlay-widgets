export interface Argument<T = any> {
	EventType: string;
	Data: T;
	Timestamp: Date;
}

export interface Records {
    LuckyFeather: Record[];
    Spotify:      Record[];
    TTS:          Record[];
    BSOD:         Record[];
}

export interface Record {
    display_name: string;
    count:        number;
}
