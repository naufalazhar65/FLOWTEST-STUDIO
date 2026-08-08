import { colors } from "../../themes";

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
                padding: 24,

                borderBottom: `1px solid ${colors.border}`,
            }}
        >
            <div
                style={{
                    fontSize: 20,

                    fontWeight: 700,

                    color: colors.text,
                }}
            >
                {title}
            </div>

            {subtitle && (
                <div
                    style={{
                        marginTop: 8,

                        color:
                            colors.textSecondary,

                        fontSize: 14,
                    }}
                >
                    {subtitle}
                </div>
            )}
        </div>
    );
}