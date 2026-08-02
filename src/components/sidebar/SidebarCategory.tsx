interface SidebarCategoryProps {
    title: string;

    count: number;

    accent: string;
}

export function SidebarCategory({
    title,
    count,
    accent,
}: SidebarCategoryProps) {
    return (
        <div
            style={{
                marginTop: 18,
                marginBottom: 12,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <div
                    style={{
                        flex: 1,
                        height: 1,
                        background: "#30363D",
                    }}
                />

                <span
                    style={{
                        color: accent,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                    }}
                >
                    {title}
                </span>

                <span
                    style={{
                        minWidth: 22,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 6px",
                        borderRadius: 999,
                        background: `${accent}22`,
                        border: `1px solid ${accent}55`,
                        color: accent,
                        fontSize: 10,
                        fontWeight: 700,
                    }}
                >
                    {count}
                </span>

                <div
                    style={{
                        flex: 1,
                        height: 1,
                        background: "#30363D",
                    }}
                />
            </div>
        </div>
    );
}