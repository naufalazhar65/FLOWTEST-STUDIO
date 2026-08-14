import {
    ChevronDown,
    ChevronRight,
    Folder,
    FolderOpen,
} from "lucide-react";

interface ExplorerFolderProps {
    name: string;

    open: boolean;

    onToggle(): void;

    children: React.ReactNode;
}

export function ExplorerFolder({
    name,
    open,
    onToggle,
    children,
}: ExplorerFolderProps) {
    return (
        <div>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-sm
                    px-3
                    py-1.5
                    text-left
                    text-sm
                    font-medium
                    text-neutral-300
                    transition-colors
                    hover:bg-neutral-800
                    focus-visible:outline-none
                    focus-visible:ring-1
                    focus-visible:ring-blue-500/60
                "
            >
                {open ? (
                    <ChevronDown
                        size={15}
                        className="shrink-0 text-neutral-500"
                    />
                ) : (
                    <ChevronRight
                        size={15}
                        className="shrink-0 text-neutral-500"
                    />
                )}

                {open ? (
                    <FolderOpen
                        size={16}
                        className="shrink-0 text-amber-400"
                    />
                ) : (
                    <Folder
                        size={16}
                        className="shrink-0 text-amber-400"
                    />
                )}

                <span className="truncate">
                    {name}
                </span>
            </button>

            {open && (
                <div
                    className="
                        ml-5
                        border-l
                        border-neutral-800
                        pl-1
                    "
                >
                    {children}
                </div>
            )}
        </div>
    );
}