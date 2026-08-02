import { Play } from "lucide-react";

interface GenerateButtonProps {
    onClick(): void;
}

export function GenerateButton({
    onClick,
}: GenerateButtonProps) {
    return (
        <button
            type="button"
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
            onClick={onClick}
        >
            <Play className="h-4 w-4" />

            Generate
        </button>
    );
}