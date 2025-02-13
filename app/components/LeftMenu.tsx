import type { Playlist } from "@/app/types/iTunesLibrary";
import { Disc, List, Mic2, Music } from "lucide-react";

interface LeftMenuProps {
	playlists: Playlist[];
	onSelectView: (view: "songs" | "albums" | "artists" | string) => void;
	selectedView: "songs" | "albums" | "artists" | string;
}

export default function LeftMenu({
	playlists,
	onSelectView,
	selectedView,
}: LeftMenuProps) {
	return (
		<div className="w-64 bg-gray-100 h-screen overflow-hidden flex flex-col">
			<div className="p-4">
				<h2 className="font-semibold text-sm mb-2 text-gray-500 uppercase">
					Library
				</h2>
				<button
					className={`flex items-center w-full text-left p-2 rounded ${
						selectedView === "songs"
							? "bg-blue-500 text-white"
							: "hover:bg-gray-200"
					}`}
					onClick={() => onSelectView("songs")}
					type="button"
				>
					<Music className="mr-2" size={16} />
					All Songs
				</button>
				<button
					className={`flex items-center w-full text-left p-2 rounded ${
						selectedView === "albums"
							? "bg-blue-500 text-white"
							: "hover:bg-gray-200"
					}`}
					onClick={() => onSelectView("albums")}
					type="button"
				>
					<Disc className="mr-2" size={16} />
					All Albums
				</button>
				<button
					className={`flex items-center w-full text-left p-2 rounded ${
						selectedView === "artists"
							? "bg-blue-500 text-white"
							: "hover:bg-gray-200"
					}`}
					onClick={() => onSelectView("artists")}
					type="button"
				>
					<Mic2 className="mr-2" size={16} />
					All Artists
				</button>
			</div>
			<div className="flex-1 overflow-hidden flex flex-col">
				<h2 className="font-semibold text-sm p-4 text-gray-500 uppercase bg-gray-100 sticky top-0 z-10">
					Playlists
				</h2>
				<div className="flex-1 overflow-y-auto">
					<div className="p-4 pt-0">
						{playlists.map((playlist, index) => (
							<button
								key={`${playlist["Playlist ID"]}-${index}`}
								className={`flex items-center w-full text-left p-2 rounded ${
									selectedView === playlist.Name
										? "bg-blue-500 text-white"
										: "hover:bg-gray-200"
								}`}
								onClick={() => onSelectView(playlist.Name)}
								type="button"
							>
								<List className="mr-2" size={16} />
								{playlist.Name}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
