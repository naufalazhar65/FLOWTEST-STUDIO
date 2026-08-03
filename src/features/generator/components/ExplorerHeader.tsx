import {
    ChevronDown,
    FolderTree,
} from "lucide-react";

export function ExplorerHeader() {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                border-b
                border-neutral-800
                bg-neutral-900
                px-3
                py-2
            "
        >
            <div
                className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-neutral-400
                "
            >
                <ChevronDown size={14} />

                <FolderTree size={14} />

                Explorer
            </div>

            <span
                className="
                    rounded
                    bg-neutral-800
                    px-2
                    py-0.5
                    text-[10px]
                    text-neutral-500
                "
            >
                Files
            </span>
        </div>
    );
}