import { RefreshCw } from "lucide-react";

interface FloatingButtonProps {
	onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
	return (
		<button
			onClick={onClick}
			className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors duration-200"
			aria-label="Start over with a new file"
			type="button"
		>
			<RefreshCw size={24} />
		</button>
	);
}
