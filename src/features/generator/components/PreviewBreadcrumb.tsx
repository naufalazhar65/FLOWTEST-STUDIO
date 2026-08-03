import { ChevronRight } from "lucide-react";

interface Props {
    path: string;
}

export function PreviewBreadcrumb({
    path,
}: Props) {
    const parts =
        path.split("/");

    return (
        <div
            className="
                flex
                items-center
                gap-1
                border-b
                border-neutral-800
                bg-neutral-950
                px-3
                py-1.5
                text-xs
                text-neutral-500
            "
        >
            {parts.map(
                (part, index) => (
                    <div
                        key={part}
                        className="flex items-center gap-1"
                    >
                        {index > 0 && (
                            <ChevronRight size={12} />
                        )}

                        <span>{part}</span>

                    </div>
                ),
            )}
        </div>
    );
}