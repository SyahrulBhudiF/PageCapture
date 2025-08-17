export interface User {
	uuid: string;
	email: string;
	password: string;
	name: string;
	profilePicture?: string;
	publicId?: string;
	emailVerified?: Date | null;
	createdAt?: Date;
	updatedAt?: Date;
}
