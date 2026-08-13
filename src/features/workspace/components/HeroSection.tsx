import { Workflow } from "lucide-react";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../../themes";

export function HeroSection() {
    return (
        <section
            style={{
                display: "flex",

                flexDirection:
                    "column",

                alignItems: "center",

                textAlign: "center",

                maxWidth: 620,
            }}
        >
            {/* Logo / Icon */}
            <div
                style={{
                    position:
                        "relative",

                    width: 68,

                    height: 68,

                    display: "flex",

                    alignItems: "center",

                    justifyContent:
                        "center",

                    marginBottom:
                        spacing.lg,

                    borderRadius:
                        radius.lg,

                    background:
                        colors.selection,

                    border:
                        `1px solid ${colors.focus}38`,

                    boxShadow:
                        `0 0 45px ${colors.accent}1F`,
                }}
            >
                <Workflow
                    size={34}
                    strokeWidth={1.8}
                    color={
                        colors.accentHover
                    }
                />
            </div>

            {/* Title */}
            <h1
                style={{
                    margin: 0,

                    color:
                        colors.text,

                    fontSize: 48,

                    lineHeight: 1.1,

                    fontWeight:
                        typography.title
                            .fontWeight,

                    letterSpacing:
                        "-0.03em",
                }}
            >
                FlowTest Studio
            </h1>

            {/* Subtitle */}
            <p
                style={{
                    marginTop:
                        spacing.md,

                    marginBottom: 0,

                    color:
                        colors.textSecondary,

                    fontSize: 16,

                    lineHeight: 1.5,
                }}
            >
                Visual Mobile Automation
                Testing IDE
            </p>

            {/* Status */}
            <div
                style={{
                    display: "flex",

                    alignItems: "center",

                    gap: spacing.xs + 2,

                    marginTop:
                        spacing.md,

                    color:
                        colors.textMuted,

                    fontSize:
                        typography.caption
                            .fontSize,
                }}
            >
                <span
                    style={{
                        width: 6,

                        height: 6,

                        flexShrink: 0,

                        borderRadius:
                            radius.full,

                        background:
                            colors.success,

                        boxShadow:
                            `0 0 8px ${colors.success}73`,
                    }}
                />

                <span>
                    Ready to build your flow
                </span>
            </div>
        </section>
    );
}