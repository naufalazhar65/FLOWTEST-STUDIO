import { Copy } from "lucide-react";

interface CopyButtonProps {
    disabled: boolean;

    onClick(): void;
}

export function CopyButton({
    disabled,
    onClick,
}: CopyButtonProps) {
    return (
        <button
            type="button"
            className="inline-flex items-center gap-2 rounded border px-3 py-1 text-sm hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800"
            disabled={disabled}
            onClick={onClick}
        >
            <Copy className="h-4 w-4" />

            Copy
        </button>
    );
}