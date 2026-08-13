import {
    radius,
} from "../../themes";

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

                flexShrink: 0,

                borderRadius:
                    radius.full,

                background: color,

                boxShadow:
                    `0 0 10px ${color}`,

                animation: animated
                    ? "pulse 1.2s infinite"
                    : undefined,
            }}
        />
    );
}