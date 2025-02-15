"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/components/ui/card";
import {
	Disc,
	FileSearch,
	Library,
	ListMusic,
	Music2,
	AirplayIcon as Spotify,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { ITunesLibrary } from "../types/iTunesLibrary";
import { parseITunesLibrary } from "../utils/xmlParser";
import LoadingSpinner from "./LoadingSpinner";

interface LandingPageProps {
	onLibraryParsed: (library: ITunesLibrary) => void;
}

export default function LandingPage({ onLibraryParsed }: LandingPageProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (file) {
				setIsLoading(true);
				setError(null);
				const reader = new FileReader();
				reader.onload = async (e) => {
					try {
						const text = e.target?.result;
						if (typeof text !== "string") {
							throw new Error("Invalid file content");
						}
						const parsedLibrary = await parseITunesLibrary(text);
						onLibraryParsed(parsedLibrary);
					} catch (error) {
						console.error("Error parsing iTunes library:", error);
						setError(
							`Error parsing iTunes library: ${error instanceof Error ? error.message : String(error)}`,
						);
					} finally {
						setIsLoading(false);
					}
				};
				reader.onerror = (e) => {
					console.error("FileReader error:", e);
					setError("Error reading file");
					setIsLoading(false);
				};
				reader.readAsText(file);
			}
		},
		[onLibraryParsed],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "text/xml": [".xml"] },
		multiple: false,
	});

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Header */}
			<header className="border-b">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Music2 className="h-6 w-6 text-blue-500" />
						<span className="font-semibold text-xl">iTunes Library Viewer</span>
					</div>
					<div className="flex items-center align-middle gap-4">
						<a
							href="https://github.com/blackhaj/itunes-library-viewer"
							target="_blank"
							rel="noreferrer"
							className="text-gray-600 hover:text-gray-900"
						>
							<svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
								<title>Github logo</title>
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
							</svg>
						</a>
						<div className="text-xs text-red-400 border border-red-400 rounded px-2 py-1 bg-gray-50">
							Not affiliated with Apple Inc. or iTunes in any way
						</div>
					</div>
				</div>
			</header>

			{/* Hero Section with Dropzone */}
			<section className="py-20 text-center">
				<div className="container mx-auto px-4">
					<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent pb-1">
						Explore your old iTunes libraries
					</h1>
					<div className="my-8 max-w-2xl mx-auto">
						<p className="text-xl  text-gray-600  ">
							Drop in your "iTunes Library.xml" file to find hidden gems from
							your old collection
						</p>
					</div>
					<div
						{...getRootProps()}
						className={`border-2 border-dashed rounded-lg p-10 transition-colors ${
							isDragActive
								? "border-blue-500 bg-blue-50"
								: "border-gray-300 hover:border-gray-400"
						}`}
					>
						<input {...getInputProps()} />
						{isLoading ? (
							<LoadingSpinner />
						) : isDragActive ? (
							<p className="text-lg">
								Drop the iTunes Library.xml file here...
							</p>
						) : (
							<p className="text-lg">
								Drag and drop your iTunes Library.xml file here, or click to
								select the file
							</p>
						)}
					</div>
					{error && (
						<div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
							{error}
						</div>
					)}
					<div className="mt-4 text-sm text-gray-600 flex justify-center gap-2">
						<button
							type="button"
							onClick={async () => {
								setIsLoading(true);
								setError(null);
								try {
									const response = await fetch(
										"https://raw.githubusercontent.com/jasonrudolph/stratify/refs/heads/master/spec/fixtures/iTunes%20Music%20Library.xml",
									);
									if (response.status === 429) {
										setError("Please try again later.");
										return;
									}
									const text = await response.text();
									const parsedLibrary = await parseITunesLibrary(text);
									onLibraryParsed(parsedLibrary);
								} catch (error) {
									console.error("Error loading example library:", error);
									setError(
										`Error loading example library: ${error instanceof Error ? error.message : String(error)}`,
									);
								} finally {
									setIsLoading(false);
								}
							}}
							className="text-blue-500 hover:text-blue-600 underline flex items-center justify-center gap-2"
						>
							<Disc className="h-4 w-4" />
							Try with an example iTunes Library.xml file
						</button>
						<a
							href="https://github.com/jasonrudolph/stratify/blob/master/spec/fixtures/iTunes%20Music%20Library.xml?utm_source=chatgpt.com"
							className="text-blue-500 hover:text-blue-600 underline"
							target="_blank"
							rel="noreferrer"
						>
							(source)
						</a>
					</div>
					<div className="mt-14">
						<h2 className="text-3xl font-bold text-center mb-12">
							How it looks 👇
						</h2>
						<img
							src="/screenshot.png"
							alt="Screenshot of the iTunes Library Viewer application"
							className="rounded-lg shadow-lg max-w-screen-md mx-auto"
						/>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-12">
						Some handy features
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						<Card>
							<CardHeader>
								<FileSearch className="h-8 w-8 text-blue-500 mb-2" />
								<CardTitle>Easy Import</CardTitle>
								<CardDescription>
									Drag and drop your iTunes Library.xml file to get started in
									seconds
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<ListMusic className="h-8 w-8 text-blue-500 mb-2" />
								<CardTitle>See all your music</CardTitle>
								<CardDescription>
									View your music by songs, albums, artists, or playlists (but
									mainly playlists, the other bits are crap)
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<Library className="h-8 w-8 text-blue-500 mb-2" />
								<CardTitle>Very basic search</CardTitle>
								<CardDescription>
									You can search. It's pretty basic but it might be useful
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<Spotify className="h-8 w-8 text-blue-500 mb-2" />
								<CardTitle>Spotify Integration</CardTitle>
								<CardDescription>
									By integration, I mean you can click the title and it will
									open a new tab with the artist and song searched.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t py-8">
				<div className="container mx-auto px-4 text-center text-gray-600">
					<p>
						iTunes Library Viewer - A{" "}
						<span className="line-through">modern</span> way to browse your
						music collection
					</p>
				</div>
			</footer>
		</div>
	);
}
