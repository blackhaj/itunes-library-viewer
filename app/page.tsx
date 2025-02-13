"use client";

import { useState } from "react";
import FloatingButton from "./components/FloatingButton";
import ITunesInterface from "./components/ITunesInterface";
import LandingPage from "./components/LandingPage";
import type { ITunesLibrary } from "./types/iTunesLibrary";

export default function Home() {
	const [library, setLibrary] = useState<ITunesLibrary | null>(null);

	const handleLibraryParsed = (parsedLibrary: ITunesLibrary) => {
		setLibrary(parsedLibrary);
	};

	const handleReset = () => {
		setLibrary(null);
	};

	if (!library) {
		return <LandingPage onLibraryParsed={handleLibraryParsed} />;
	}

	return (
		<main className="min-h-screen relative">
			<ITunesInterface library={library} />
			<FloatingButton onClick={handleReset} />
		</main>
	);
}
