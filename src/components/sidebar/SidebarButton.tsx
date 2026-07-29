import type { CSSProperties, ReactNode } from "react";

interface SidebarButtonProps {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function SidebarButton({
    icon,
    label,
    onClick,
    disabled,
}: SidebarButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={buttonStyle(disabled)}
            onMouseEnter={(e) => {
                if (disabled) return;

                e.currentTarget.style.background =
                    "#1C212B";

                e.currentTarget.style.borderColor =
                    "#3B82F6";


            }}

            onMouseLeave={(e) => {
                if (disabled) return;

                e.currentTarget.style.background =
                    "#0D1117";

                e.currentTarget.style.borderColor =
                    "#30363D";

                e.currentTarget.style.transform =
                    "translateX(0px)";
            }}
        >
            {icon}

            <span
                style={{
                    fontSize: 14,
                    fontWeight: 500,
                    transform: "translateX(0px)",
                    transition:
                        "all .18s ease",
                }}
            >
                {label}
            </span>
        </button>
    );
}

function buttonStyle(
    disabled?: boolean,
): CSSProperties {
    return {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        marginBottom: 10,
        borderRadius: 12,
        border: "1px solid #30363D",
        background: disabled
            ? "#1A1F27"
            : "#0D1117",
        color: disabled
            ? "#555"
            : "#FFF",
        cursor: disabled
            ? "not-allowed"
            : "pointer",
        transition: "all .2s ease",
    };
}