export interface User {
	id: string;
	user_name: string;
	display_name: string;
	nickname: string;
	timezone: null;
	timezone_info: null;
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	color: string;
	broadcaster_type: string;
	enabled: boolean;
	pronoun: Pronoun;
	created_at: Date;
	updated_at: Date;
}

export interface Pronoun {
	id: number;
	name: string;
	subject: string;
	object: string;
	singular: boolean;
}
