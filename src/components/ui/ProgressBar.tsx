interface ProgressBarProps {
    progress: number;

    color?: string;

    width?: number | string;

    height?: number;
}

export function ProgressBar({
    progress,
    color = "#22C55E",
    width = "100%",
    height = 6,
}: ProgressBarProps) {
    const value = Math.max(
        0,
        Math.min(progress, 100),
    );

    return (
        <div
            style={{
                width,
                height,

                borderRadius: 999,

                background: "#30363D",

                overflow: "hidden",

                position: "relative",
            }}
        >
            <div
                style={{
                    width: `${value}%`,
                    height: "100%",

                    background: color,

                    borderRadius: 999,

                    transition:
                        "width .35s ease, background-color .25s ease",

                    boxShadow:
                        value > 0
                            ? `0 0 8px ${color}66`
                            : undefined,
                }}
            />
        </div>
    );
}