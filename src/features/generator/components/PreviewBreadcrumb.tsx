import { ChevronRight } from "lucide-react";

interface Props {
    path: string;
}

export function PreviewBreadcrumb({
    path,
}: Props) {
    const parts = path.split("/");

    return (
        <div
            className="
                flex
                min-w-0
                items-center
                gap-1
                overflow-hidden
                border-b
                border-neutral-800
                bg-neutral-950
                px-3
                py-1.5
                text-xs
            "
        >
            {parts.map(
                (part, index) => {
                    const isLast =
                        index ===
                        parts.length - 1;

                    return (
                        <div
                            key={`${part}-${index}`}
                            className="
                                flex
                                min-w-0
                                shrink-0
                                items-center
                                gap-1
                            "
                        >
                            {index > 0 && (
                                <ChevronRight
                                    size={12}
                                    className="text-neutral-700"
                                />
                            )}

                            <span
                                title={part}
                                className={`
                                    max-w-48
                                    truncate
                                    ${
                                        isLast
                                            ? "font-medium text-neutral-300"
                                            : "text-neutral-600"
                                    }
                                `}
                            >
                                {part}
                            </span>
                        </div>
                    );
                },
            )}
        </div>
    );
}