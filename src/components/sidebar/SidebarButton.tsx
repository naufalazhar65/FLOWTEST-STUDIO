import type {
    CSSProperties,
    ReactNode,
} from "react";

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
                    "#161B22";

                e.currentTarget.style.borderColor =
                    "#3B82F6";

                e.currentTarget.style.transform =
                    "translateY(-2px)";

                e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(59,130,246,.18)";
            }}
            onMouseLeave={(e) => {
                if (disabled) return;

                e.currentTarget.style.background =
                    "#0D1117";

                e.currentTarget.style.borderColor =
                    "#30363D";

                e.currentTarget.style.transform =
                    "translateY(0px)";

                e.currentTarget.style.boxShadow =
                    "none";
            }}
        >
            <div style={iconContainer}>
                {icon}
            </div>

            <div style={content}>
                <span style={title}>
                    {label}
                </span>

                <span style={subtitle}>
                    Click to add
                </span>
            </div>
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

        gap: 14,

        padding: "12px",

        marginBottom: 10,

        borderRadius: 12,

        border: "1px solid #30363D",

        background: disabled
            ? "#1A1F27"
            : "#0D1117",

        color: disabled
            ? "#555"
            : "#FFFFFF",

        cursor: disabled
            ? "not-allowed"
            : "pointer",

        transition:
            "all .18s ease",

        textAlign: "left",
    };
}

const iconContainer: CSSProperties = {
    width: 42,

    height: 42,

    borderRadius: 10,

    background: "#1C2330",

    border: "1px solid #2B3648",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    flexShrink: 0,

    color: "#58A6FF",
};

const content: CSSProperties = {
    display: "flex",

    flexDirection: "column",

    alignItems: "flex-start",

    overflow: "hidden",

    minWidth: 0,
};

const title: CSSProperties = {
    fontSize: 14,

    fontWeight: 600,

    color: "#E6EDF3",

    whiteSpace: "nowrap",

    overflow: "hidden",

    textOverflow: "ellipsis",
};

const subtitle: CSSProperties = {
    marginTop: 4,

    fontSize: 12,

    color: "#8B949E",

    whiteSpace: "nowrap",

    overflow: "hidden",

    textOverflow: "ellipsis",
};