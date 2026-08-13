import {
    colors,
    spacing,
    typography,
} from "../../themes";

interface Props {
    title: string;

    subtitle?: string;
}

export function DialogHeader({
    title,
    subtitle,
}: Props) {
    return (
        <div
            style={{
                padding:
                    `${spacing.lg}px ${spacing.xl}px`,

                borderBottom:
                    `1px solid ${colors.border}`,
            }}
        >
            <div
                style={{
                    color:
                        colors.text,

                    fontSize:
                        typography.title
                            .fontSize,

                    fontWeight:
                        typography.title
                            .fontWeight,

                    lineHeight: 1.4,
                }}
            >
                {title}
            </div>

            {subtitle && (
                <div
                    style={{
                        marginTop:
                            spacing.sm,

                        color:
                            colors.textSecondary,

                        fontSize:
                            typography.body
                                .fontSize,

                        fontWeight:
                            typography.body
                                .fontWeight,

                        lineHeight: 1.5,
                    }}
                >
                    {subtitle}
                </div>
            )}
        </div>
    );
}