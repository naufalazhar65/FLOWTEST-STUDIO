import { Search } from "lucide-react";

interface ExplorerSearchProps {
    value: string;

    onChange(value: string): void;
}

export function ExplorerSearch({
    value,
    onChange,
}: ExplorerSearchProps) {
    return (
        <div className="border-b border-neutral-800 p-2">
            <div
                className="
                    flex
                    items-center
                    gap-2
                    rounded-md
                    border
                    border-neutral-800
                    bg-neutral-950
                    px-2.5
                    py-2
                    transition-colors
                    focus-within:border-blue-500/40
                    focus-within:bg-neutral-900
                "
            >
                <Search
                    size={14}
                    className="shrink-0 text-neutral-500"
                />

                <input
                    type="search"
                    value={value}
                    onChange={(event) =>
                        onChange(
                            event.target.value,
                        )
                    }
                    placeholder="Search files..."
                    aria-label="Search files"
                    className="
                        w-full
                        min-w-0
                        bg-transparent
                        text-sm
                        text-neutral-300
                        outline-none
                        placeholder:text-neutral-600
                    "
                />
            </div>
        </div>
    );
}