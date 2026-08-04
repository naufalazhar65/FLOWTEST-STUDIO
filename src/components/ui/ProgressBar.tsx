interface ProgressBarProps {
    progress: number;
    color: string;
}

export function ProgressBar({
    progress,
    color,
}: ProgressBarProps) {
    return (
        <div
            className="
                h-[6px]
                w-full
                overflow-hidden
                rounded-full
                bg-neutral-800
            "
        >
            <div
                className="
                    h-full
                    rounded-full
                    transition-all
                    duration-300
                    ease-out
                "
                style={{
                    width: `${progress}%`,
                    background: color,
                }}
            />
        </div>
    );
}