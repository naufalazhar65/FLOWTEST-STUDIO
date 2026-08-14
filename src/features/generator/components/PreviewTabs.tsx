import {
    FileCode2,
    X,
} from "lucide-react";

interface PreviewTabsProps {
    openFiles: string[];

    activeFile: string | null;

    onSelect(path: string): void;

    onClose(path: string): void;
}

export function PreviewTabs({
    openFiles,
    activeFile,
    onSelect,
    onClose,
}: PreviewTabsProps) {
    if (openFiles.length === 0) {
        return (
            <div
                className="
                    flex
                    h-9
                    items-center
                    border-b
                    border-neutral-800
                    bg-neutral-900
                    px-3
                    text-xs
                    text-neutral-600
                "
            >
                No open files
            </div>
        );
    }

    return (
        <div
            role="tablist"
            aria-label="Open files"
            className="
                flex
                min-h-9
                overflow-x-auto
                border-b
                border-neutral-800
                bg-neutral-900
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
            "
        >
            {openFiles.map((path) => {
                const filename =
                    path.split("/").pop() ??
                    path;

                const active =
                    activeFile === path;

                return (
                    <div
                        key={path}
                        role="presentation"
                        className={`
                            group
                            relative
                            flex
                            shrink-0
                            items-center
                            border-r
                            border-neutral-800
                            ${active
                                ? "bg-neutral-800"
                                : "bg-neutral-900"
                            }
                        `}
                    >
                        {active && (
                            <div
                                className="
                                    absolute
                                    inset-x-0
                                    bottom-0
                                    h-0.5
                                    bg-blue-500
                                "
                            />
                        )}

                        <button
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() =>
                                onSelect(path)
                            }
                            title={path}
                            className={`
                                flex
                                min-w-0
                                max-w-56
                                items-center
                                gap-2
                                py-2
                                pl-3
                                pr-1
                                text-sm
                                transition-colors
                                focus-visible:outline-none
                                focus-visible:ring-1
                                focus-visible:ring-inset
                                focus-visible:ring-blue-500/60

                                ${active
                                    ? "text-white"
                                    : "text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200"
                                }
                            `}
                        >
                            <FileCode2
                                size={14}
                                className={`
                                    shrink-0
                                    ${active
                                        ? "text-blue-400"
                                        : "text-neutral-500"
                                    }
                                `}
                            />

                            <span className="truncate">
                                {filename}
                            </span>
                        </button>

                        <button
                            type="button"
                            aria-label={`Close ${filename}`}
                            title={`Close ${filename}`}
                            onClick={() =>
                                onClose(path)
                            }
                            className="
                                mr-1
                                flex
                                h-6
                                w-6
                                shrink-0
                                items-center
                                justify-center
                                rounded
                                text-neutral-500
                                opacity-0
                                transition-all
                                hover:bg-neutral-700
                                hover:text-neutral-200
                                group-hover:opacity-100
                                focus-visible:opacity-100
                                focus-visible:outline-none
                                focus-visible:ring-1
                                focus-visible:ring-blue-500/60
                            "
                        >
                            <X size={13} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}