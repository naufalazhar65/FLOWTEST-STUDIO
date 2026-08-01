interface ProgressBarProps {
    progress: number;

    color?: string;
}

export function ProgressBar({
    progress,
    color = "#22C55E",
}: ProgressBarProps) {
    return (
        <div
            style={{
                width: 120,
                height: 6,

                borderRadius: 999,

                background: "#30363D",

                overflow: "hidden",
            }}
        >
            <div
                style={{
                    width: `${progress}%`,
                    height: "100%",

                    background: color,

                    transition: "width .3s",
                }}
            />
        </div>
    );
}