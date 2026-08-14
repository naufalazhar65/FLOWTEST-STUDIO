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
            aria-current={
                active
                    ? "page"
                    : undefined
            }
            className={`
                relative
                flex
                w-full
                items-center
                gap-2
                py-1.5
                pl-7
                pr-3
                text-left
                text-sm
                transition-colors
                focus-visible:outline-none
                focus-visible:ring-1
                focus-visible:ring-inset
                focus-visible:ring-blue-500/60

                ${
                    active
                        ? `
                            bg-blue-500/15
                            text-white
                        `
                        : `
                            text-neutral-400
                            hover:bg-neutral-800
                            hover:text-neutral-200
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
                        w-0.5
                        bg-blue-500
                    "
                />
            )}

            <span className="shrink-0">
                {getFileIcon(name)}
            </span>

            <span className="truncate">
                {name}
            </span>
        </button>
    );
}