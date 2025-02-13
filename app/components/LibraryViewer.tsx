"use client";

import type { ITunesLibrary } from "@/app/types/iTunesLibrary";
import FloatingButton from "./FloatingButton";
import ITunesInterface from "./ITunesInterface";

interface LibraryViewerProps {
	library: ITunesLibrary;
	onReset: () => void;
}

export default function LibraryViewer({
	library,
	onReset,
}: LibraryViewerProps) {
	return (
		<div className="w-full h-screen">
			<ITunesInterface library={library} />
			<FloatingButton onClick={onReset} />
		</div>
	);
}
