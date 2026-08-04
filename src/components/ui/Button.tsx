import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

interface Props
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;

    variant?: "primary" | "secondary";
}

export function Button({
    children,
    disabled = false,
    variant = "secondary",
    style,
    ...props
}: Props) {
    const background =
        disabled
            ? "#30363D"
            : variant === "primary"
              ? "#2563EB"
              : "#1F2937";

    const border =
        disabled
            ? "#30363D"
            : variant === "primary"
              ? "#2563EB"
              : "#374151";

    const color = disabled
        ? "#8B949E"
        : "#FFFFFF";

    return (
        <button
            {...props}
            disabled={disabled}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",

                gap: 8,

                height: 40,

                minWidth: 96,

                padding: "0 16px",

                borderRadius: 10,

                border: `1px solid ${border}`,

                background,

                color,

                fontSize: 14,

                fontWeight: 600,

                whiteSpace: "nowrap",

                cursor: disabled
                    ? "not-allowed"
                    : "pointer",

                transition:
                    "all .18s ease",

                userSelect: "none",

                ...style,
            }}
            onMouseEnter={(e) => {
                if (disabled) {
                    return;
                }

                if (variant === "primary") {
                    e.currentTarget.style.background =
                        "#3B82F6";
                } else {
                    e.currentTarget.style.background =
                        "#374151";
                    e.currentTarget.style.borderColor =
                        "#4B5563";
                }
            }}
            onMouseLeave={(e) => {
                if (disabled) {
                    return;
                }

                e.currentTarget.style.background =
                    background;

                e.currentTarget.style.borderColor =
                    border;
            }}
        >
            {children}
        </button>
    );
}