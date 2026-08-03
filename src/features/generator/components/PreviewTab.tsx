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
    return (
        <div
            className="
                flex
                overflow-x-auto
                border-b
                border-neutral-800
                bg-neutral-900
            "
        >
            {openFiles.map((path) => {
                const filename =
                    path.split("/").pop() ??
                    path;

                const active =
                    activeFile === path;

                return (
                    <button
                        key={path}
                        type="button"
                        onClick={() =>
                            onSelect(path)
                        }
                        className={`
                            flex
                            shrink-0
                            items-center
                            gap-2
                            border-r
                            border-neutral-800
                            px-3
                            py-2
                            text-sm
                            transition-colors

                            ${
                                active
                                    ? `
                                        bg-neutral-800
                                        text-white
                                    `
                                    : `
                                        text-neutral-400
                                        hover:bg-neutral-850
                                    `
                            }
                        `}
                    >
                        <FileCode2
                            size={14}
                        />

                        <span>
                            {filename}
                        </span>

                        <X
                            size={13}
                            className="
                                rounded
                                hover:bg-neutral-700
                            "
                            onClick={(
                                event,
                            ) => {
                                event.stopPropagation();

                                onClose(path);
                            }}
                        />
                    </button>
                );
            })}
        </div>
    );
}