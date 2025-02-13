"use client";

import { ChevronDown, ChevronUp, Disc, Mic2, Music } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ITunesLibrary, Playlist, Track } from "../types/iTunesLibrary";
import LeftMenu from "./LeftMenu";

interface ITunesInterfaceProps {
	library: ITunesLibrary;
}

type SortConfig = {
	key: keyof Track;
	direction: "asc" | "desc" | null;
};

export default function ITunesInterface({ library }: ITunesInterfaceProps) {
	const [selectedMenuItem, setSelectedMenuItem] = useState<
		"songs" | "albums" | "artists" | string
	>("songs");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
	const [itemCount, setItemCount] = useState<number>(0);
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: "Name",
		direction: null,
	});

	const tracks = useMemo(() => Object.values(library.Tracks), [library]);
	const playlists = useMemo(() => {
		return library.Playlists.reduce((acc: Playlist[], playlist: Playlist) => {
			if (!acc.find((p) => p.Name === playlist.Name)) {
				acc.push(playlist);
			}
			return acc;
		}, []);
	}, [library]);

	const filteredTracks = useMemo(() => {
		let filtered = tracks;
		if (selectedPlaylist) {
			const playlist = playlists.find((p) => p.Name === selectedPlaylist);
			if (playlist?.["Playlist Items"]) {
				const trackIds = new Set(
					playlist["Playlist Items"].map((item) => item["Track ID"]),
				);
				filtered = tracks.filter((track) => trackIds.has(track["Track ID"]));
			}
		}
		return filtered.filter(
			(track) =>
				String(track.Name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				String(track.Artist)
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				String(track.Album)?.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [tracks, selectedPlaylist, playlists, searchTerm]);

	const sortedTracks = useMemo(() => {
		const sortableTracks = [...filteredTracks];
		if (sortConfig.direction) {
			sortableTracks.sort((a, b) => {
				const aValue = a[sortConfig.key];
				const bValue = b[sortConfig.key];

				if (!aValue || !bValue) {
					return 0;
				}

				if (aValue < bValue) {
					return sortConfig.direction === "asc" ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortConfig.direction === "asc" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableTracks;
	}, [filteredTracks, sortConfig]);

	useEffect(() => {
		let count = 0;
		switch (selectedMenuItem) {
			case "songs":
				count = sortedTracks.length;
				break;
			case "albums":
				count = new Set(sortedTracks.map((track) => track.Album)).size;
				break;
			case "artists":
				count = new Set(sortedTracks.map((track) => track.Artist)).size;
				break;
			default: {
				const playlist = playlists.find((p) => p.Name === selectedMenuItem);
				if (playlist?.["Playlist Items"]) {
					count = playlist["Playlist Items"].length;
				}
			}
		}
		setItemCount(count);
	}, [selectedMenuItem, sortedTracks, playlists]);

	const requestSort = (key: keyof Track) => {
		let direction: "asc" | "desc" | null = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		} else if (sortConfig.key === key && sortConfig.direction === "desc") {
			direction = null;
		}
		setSortConfig({ key, direction });
	};

	const SortableHeader = ({ column }: { column: keyof Track }) => (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<th
			className="py-2 cursor-pointer select-none"
			onClick={() => requestSort(column)}
		>
			<div className="flex items-center">
				{column}
				{sortConfig.key === column &&
					(sortConfig.direction === "asc" ? (
						<ChevronUp className="ml-1" size={16} />
					) : sortConfig.direction === "desc" ? (
						<ChevronDown className="ml-1" size={16} />
					) : null)}
			</div>
		</th>
	);

	const getSpotifySearchUrl = (track: Track) => {
		const query = `${track.Name} ${track.Artist}`.trim();
		return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
	};

	const renderContent = () => {
		switch (selectedMenuItem) {
			case "songs":
				return (
					<table className="w-full text-left">
						<thead className="sticky top-0 bg-white">
							<tr className="border-b">
								<SortableHeader column="Name" />
								<SortableHeader column="Artist" />
								<SortableHeader column="Album" />
								<SortableHeader column="Total Time" />
								<SortableHeader column="Genre" />
								<SortableHeader column="Play Count" />
								<SortableHeader column="Year" />
							</tr>
						</thead>
						<tbody>
							{sortedTracks.map((track) => (
								<tr
									key={track["Track ID"]}
									className="border-b hover:bg-gray-100"
								>
									<td className="py-2">
										<a
											href={getSpotifySearchUrl(track)}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:underline"
										>
											{track.Name}
										</a>
									</td>
									<td className="py-2">{track.Artist}</td>
									<td className="py-2">{track.Album}</td>
									<td className="py-2">
										{Math.floor(track["Total Time"] / 60000)}:
										{((track["Total Time"] % 60000) / 1000)
											.toFixed(0)
											.padStart(2, "0")}
									</td>
									<td className="py-2">{track.Genre}</td>
									<td className="py-2">{track["Play Count"] || 0}</td>
									<td className="py-2">{track.Year}</td>
								</tr>
							))}
						</tbody>
					</table>
				);
			case "albums": {
				const albums = [...new Set(sortedTracks.map((track) => track.Album))];
				return (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{albums.map((album) => (
							<div key={album} className="text-center">
								<Disc size={64} className="mx-auto mb-2" />
								<p className="text-sm">{album}</p>
							</div>
						))}
					</div>
				);
			}
			case "artists": {
				const artists = [...new Set(sortedTracks.map((track) => track.Artist))];
				return (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{artists.map((artist) => (
							<div key={artist} className="text-center">
								<Mic2 size={64} className="mx-auto mb-2" />
								<p className="text-sm">{artist}</p>
							</div>
						))}
					</div>
				);
			}
			default: {
				const playlist = playlists.find((p) => p.Name === selectedMenuItem);
				if (playlist?.["Playlist Items"]) {
					const trackIds = new Set(
						playlist["Playlist Items"].map((item) => item["Track ID"]),
					);
					const playlistTracks = sortedTracks.filter((track) =>
						trackIds.has(track["Track ID"]),
					);
					return (
						<table className="w-full text-left">
							<thead className="sticky top-0 bg-white">
								<tr className="border-b">
									<SortableHeader column="Name" />
									<SortableHeader column="Artist" />
									<SortableHeader column="Album" />
									<SortableHeader column="Total Time" />
									<SortableHeader column="Genre" />
									<SortableHeader column="Play Count" />
									<SortableHeader column="Year" />
								</tr>
							</thead>
							<tbody>
								{playlistTracks.map((track) => (
									<tr
										key={track["Track ID"]}
										className="border-b hover:bg-gray-100"
									>
										<td className="py-2">
											<a
												href={getSpotifySearchUrl(track)}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline"
											>
												{track.Name}
											</a>
										</td>
										<td className="py-2">{track.Artist}</td>
										<td className="py-2">{track.Album}</td>
										<td className="py-2">
											{Math.floor(track["Total Time"] / 60000)}:
											{((track["Total Time"] % 60000) / 1000)
												.toFixed(0)
												.padStart(2, "0")}
										</td>
										<td className="py-2">{track.Genre}</td>
										<td className="py-2">{track["Play Count"] || 0}</td>
										<td className="py-2">{track.Year}</td>
									</tr>
								))}
							</tbody>
						</table>
					);
				}
				return null;
			}
		}
	};

	return (
		<div className="flex h-screen bg-white overflow-hidden">
			<LeftMenu
				playlists={playlists}
				onSelectView={setSelectedMenuItem}
				selectedView={selectedMenuItem}
			/>
			<div className="flex-1 flex flex-col overflow-hidden">
				<div className="bg-gray-200 p-4 flex justify-end items-center">
					<input
						type="text"
						placeholder="Search..."
						className="px-2 py-1 border rounded"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
				<div className="bg-gray-200 p-2 text-sm text-gray-600 border-t flex justify-center items-center">
					{itemCount} items
				</div>
			</div>
		</div>
	);
}
