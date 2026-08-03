import { getFileIcon } from "../utils/getFileIcon";

interface ExplorerFileProps {
    active: boolean;

    name: string;

    onClick(): void;
}

export function ExplorerFile({
    active,
    name,
    onClick,
}: ExplorerFileProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                relative
                flex
                w-full
                items-center
                gap-2
                pl-6
                pr-3
                py-2
                text-left
                text-sm
                transition-all

                ${
                    active
                        ? `
                            bg-blue-500/15
                            text-white
                        `
                        : `
                            text-neutral-300
                            hover:bg-neutral-800
                        `
                }
            `}
        >
            {active && (

                <div
                    className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-1
                        rounded-r
                        bg-blue-500
                    "
                />

            )}

            {getFileIcon(name)}

            <span className="truncate">
                {name}
            </span>

        </button>
    );
}