import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    FolderOpen,
    Folder,
} from "lucide-react";

interface ExplorerFolderProps {
    name: string;
    children: React.ReactNode;
}

export function ExplorerFolder({
    name,
    children,
}: ExplorerFolderProps) {
    const [open, setOpen] =
        useState(true);

    return (
        <div>

            <button
                type="button"
                onClick={() =>
                    setOpen(!open)
                }
                className="
                    flex
                    w-full
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    text-left
                    text-sm
                    font-medium
                    text-neutral-300
                    transition
                    hover:bg-neutral-800
                "
            >
                {open ? (
                    <ChevronDown size={15} />
                ) : (
                    <ChevronRight size={15} />
                )}

                {open ? (
                    <FolderOpen
                        size={16}
                        className="text-amber-400"
                    />
                ) : (
                    <Folder
                        size={16}
                        className="text-amber-400"
                    />
                )}

                <span>{name}</span>

            </button>

            {open && (

                <div
                    className="
                        ml-5
                        border-l
                        border-neutral-800
                    "
                >
                    {children}
                </div>

            )}

        </div>
    );
}