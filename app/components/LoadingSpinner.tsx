export default function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center">
			<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
			<p className="ml-4 text-lg font-semibold">Parsing library...</p>
		</div>
	);
}
