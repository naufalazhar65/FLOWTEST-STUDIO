import { Workflow } from "lucide-react";

export function HeroSection() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                textAlign: "center",
            }}
        >
            {/* Logo / Icon */}
            <div
                style={{
                    position: "relative",

                    width: 68,
                    height: 68,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    marginBottom: 18,

                    borderRadius: 18,

                    background:
                        "rgba(59, 130, 246, 0.10)",

                    border:
                        "1px solid rgba(59, 130, 246, 0.22)",

                    boxShadow:
                        "0 0 45px rgba(59, 130, 246, 0.12)",
                }}
            >
                <Workflow
                    size={34}
                    strokeWidth={1.8}
                    color="#3B82F6"
                />
            </div>

            {/* Title */}
            <h1
                style={{
                    margin: 0,

                    fontSize: 48,
                    lineHeight: 1.1,

                    fontWeight: 700,

                    letterSpacing:
                        "-0.03em",

                    color: "#F0F6FC",
                }}
            >
                FlowTest Studio
            </h1>

            {/* Subtitle */}
            <p
                style={{
                    marginTop: 14,
                    marginBottom: 0,

                    color: "#8B949E",

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
                    gap: 7,

                    marginTop: 14,

                    color: "#6E7681",

                    fontSize: 12,
                }}
            >
                <span
                    style={{
                        width: 6,
                        height: 6,

                        borderRadius: "50%",

                        background:
                            "#3FB950",

                        boxShadow:
                            "0 0 8px rgba(63, 185, 80, 0.45)",
                    }}
                />

                <span>
                    Ready to build your flow
                </span>
            </div>
        </div>
    );
}