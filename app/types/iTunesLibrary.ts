export interface Track {
	"Track ID": number;
	Name: string;
	Artist: string;
	Album: string;
	Genre: string;
	"Total Time": number;
	Year: number;
	"Date Modified": string;
	"Date Added": string;
	"Bit Rate": number;
	"Sample Rate": number;
	"Play Count"?: number;
	"Play Date"?: number;
	"Play Date UTC"?: string;
	Kind: string;
	Size: number;
}

export interface Playlist {
	"Playlist ID": number;
	"Playlist Persistent ID": string;
	Name: string;
	"All Items": boolean;
	"Playlist Items": Array<{ "Track ID": number }>;
}

export interface ITunesLibrary {
	"Major Version": number;
	"Minor Version": number;
	"Application Version": string;
	Date: string;
	Features: number;
	"Show Content Ratings": boolean;
	"Music Folder": string;
	"Library Persistent ID": string;
	Tracks: { [key: string]: Track };
	Playlists: Playlist[];
}
