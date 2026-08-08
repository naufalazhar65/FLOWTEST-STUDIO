// import { FooterSection } from "./FooterSection";
import { HeroSection } from "./HeroSection";
import { QuickActions } from "./QuickActions";
import { RecentProjects } from "./RecentProjects";

export function WelcomeScreen() {
    return (
        <div
            style={{
                position: "relative",

                minHeight: "100vh",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

                gap: 42,

                padding: "48px",

                overflow: "hidden",

                background: `
                    radial-gradient(
                        circle at 50% 0%,
                        rgba(59, 130, 246, 0.10),
                        transparent 38%
                    ),
                    radial-gradient(
                        rgba(139, 148, 158, 0.10) 1px,
                        transparent 1px
                    ),
                    #0D1117
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
                    position: "absolute",

                    top: -180,
                    left: "50%",

                    width: 520,
                    height: 520,

                    transform:
                        "translateX(-50%)",

                    borderRadius: "50%",

                    background:
                        "rgba(59, 130, 246, 0.06)",

                    filter:
                        "blur(100px)",

                    pointerEvents:
                        "none",
                }}
            />

            {/* Content */}
            <div
                style={{
                    position: "relative",

                    zIndex: 1,

                    width: "100%",

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",

                    gap: 42,
                }}
            >
                <HeroSection />

                <QuickActions />

                <RecentProjects />

                {/* <FooterSection /> */}
            </div>

        </div>
    );
}