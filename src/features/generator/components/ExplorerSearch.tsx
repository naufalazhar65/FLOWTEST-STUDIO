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
            <div className="flex items-center gap-2 rounded bg-neutral-900 px-2 py-2">
                <Search
                    size={14}
                    className="text-neutral-500"
                />

                <input
                    value={value}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                    placeholder="Search files..."
                    className="
                        w-full
                        bg-transparent
                        text-sm
                        text-neutral-300
                        outline-none
                        placeholder:text-neutral-500
                    "
                />
            </div>
        </div>
    );
}