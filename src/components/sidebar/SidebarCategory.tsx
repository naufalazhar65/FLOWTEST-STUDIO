import {
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

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
                marginTop:
                    spacing.lg,

                marginBottom:
                    spacing.sm,
            }}
        >
            <div
                style={{
                    display: "flex",

                    alignItems: "center",

                    gap: spacing.sm,
                }}
            >
                <div
                    style={{
                        flex: 1,

                        height: 1,

                        background:
                            colors.border,
                    }}
                />

                <span
                    style={{
                        color: accent,

                        fontSize:
                            typography.tiny
                                .fontSize,

                        fontWeight:
                            typography.caption
                                .fontWeight,

                        letterSpacing:
                            "0.08em",

                        textTransform:
                            "uppercase",

                        whiteSpace:
                            "nowrap",
                    }}
                >
                    {title}
                </span>

                <span
                    style={{
                        minWidth: 20,

                        height: 20,

                        display:
                            "inline-flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        padding:
                            "0 5px",

                        boxSizing:
                            "border-box",

                        borderRadius:
                            radius.full,

                        background:
                            `${accent}18`,

                        border:
                            `1px solid ${accent}38`,

                        color: accent,

                        fontSize:
                            typography.tiny
                                .fontSize,

                        fontWeight:
                            typography.caption
                                .fontWeight,

                        lineHeight: 1,
                    }}
                >
                    {count}
                </span>

                <div
                    style={{
                        flex: 1,

                        height: 1,

                        background:
                            colors.border,
                    }}
                />
            </div>
        </div>
    );
}