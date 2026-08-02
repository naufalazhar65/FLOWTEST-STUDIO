import { Download } from "lucide-react";

interface DownloadButtonProps {
    disabled: boolean;

    onClick(): void;
}

export function DownloadButton({
    disabled,
    onClick,
}: DownloadButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="inline-flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800"
        >
            <Download className="h-4 w-4" />

            Download
        </button>
    );
}