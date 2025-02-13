"use client";

import type { ITunesLibrary } from "@/app/types/iTunesLibrary";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { parseITunesLibrary } from "../utils/xmlParser";

interface FileUploaderProps {
	onLibraryParsed: (library: ITunesLibrary) => void;
	onFileUpload: () => void;
}

export default function FileUploader({
	onLibraryParsed,
	onFileUpload,
}: FileUploaderProps) {
	const [error, setError] = useState<string | null>(null);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0];
			if (file) {
				console.log("File selected:", file.name, "Size:", file.size, "bytes");
				onFileUpload(); // Trigger loading state
				const reader = new FileReader();
				reader.onload = async (e) => {
					try {
						const text = e.target?.result;
						if (typeof text !== "string") {
							throw new Error("Invalid file content");
						}
						console.log("File content length:", text.length);
						const parsedLibrary = await parseITunesLibrary(text);
						console.log("Library parsed successfully:", parsedLibrary);
						onLibraryParsed(parsedLibrary);
						setError(null);
					} catch (error) {
						console.error("Error in FileUploader:", error);
						setError(
							`Error parsing iTunes library: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				};
				reader.onerror = (e) => {
					console.error("FileReader error:", e);
					setError("Error reading file");
				};
				reader.readAsText(file);
			}
		},
		[onLibraryParsed, onFileUpload],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "text/xml": [".xml"] },
		multiple: false,
	});

	return (
		<div className="w-full">
			<div
				{...getRootProps()}
				className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
					isDragActive
						? "border-blue-500 bg-blue-50"
						: "border-gray-300 hover:border-gray-400"
				}`}
			>
				<input {...getInputProps()} />
				{isDragActive ? (
					<p>Drop the iTunes Library.xml file here...</p>
				) : (
					<p>
						Drag and drop your iTunes Library.xml file here, or click to select
						the file
					</p>
				)}
			</div>
			{error && (
				<div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
					{error}
				</div>
			)}
		</div>
	);
}
