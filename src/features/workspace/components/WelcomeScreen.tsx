import {
    colors,
    spacing,
} from "../../../themes";

import { HeroSection } from "./HeroSection";
import { QuickActions } from "./QuickActions";
import { RecentProjects } from "./RecentProjects";

export function WelcomeScreen() {
    return (
        <div
            style={{
                position: "relative",

                minHeight: "100vh",

                boxSizing: "border-box",

                display: "flex",

                flexDirection:
                    "column",

                alignItems: "center",

                justifyContent:
                    "center",

                padding: `${spacing.xxxl}px ${spacing.xl}px`,

                overflow: "hidden",

                background: `
                    radial-gradient(
                        circle at 50% 0%,
                        rgba(47, 129, 247, 0.10),
                        transparent 38%
                    ),
                    radial-gradient(
                        rgba(139, 148, 158, 0.08) 1px,
                        transparent 1px
                    ),
                    ${colors.background}
                `,

                backgroundSize: `
                    auto,
                    24px 24px
                `,
            }}
        >
            {/* Ambient glow */}
            <div
                style={{
                    position:
                        "absolute",

                    top: -180,

                    left: "50%",

                    width: 520,

                    height: 520,

                    transform:
                        "translateX(-50%)",

                    borderRadius:
                        "50%",

                    background:
                        "rgba(47, 129, 247, 0.055)",

                    filter:
                        "blur(100px)",

                    pointerEvents:
                        "none",
                }}
            />

            {/* Content */}
            <main
                style={{
                    position:
                        "relative",

                    zIndex: 1,

                    width: "100%",

                    maxWidth: 1100,

                    display: "flex",

                    flexDirection:
                        "column",

                    alignItems: "center",

                    gap: spacing.xxl,

                    margin: "0 auto",
                }}
            >
                <HeroSection />

                <QuickActions />

                <RecentProjects />
            </main>
        </div>
    );
}