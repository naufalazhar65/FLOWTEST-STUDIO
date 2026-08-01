interface StatusDotProps {
    color: string;

    animated?: boolean;
}

export function StatusDot({
    color,
    animated = false,
}: StatusDotProps) {
    return (
        <div
            style={{
                width: 10,
                height: 10,

                borderRadius: "50%",

                background: color,

                boxShadow: `0 0 10px ${color}`,

                animation: animated
                    ? "pulse 1.2s infinite"
                    : undefined,
            }}
        />
    );
}