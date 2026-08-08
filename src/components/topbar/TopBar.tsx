import { BrandSection } from "./BrandSection";
import { StatusSection } from "./StatusSection";
import { ActionSection } from "./ActionSection";

export function TopBar() {
    return (
        <header
            style={{
                height: 60,

                display: "flex",
                alignItems: "center",
                justifyContent:
                    "space-between",

                padding: "0 20px",

                background: "#161B22",

                borderBottom:
                    "1px solid #30363D",
            }}
        >
            {/* Left */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                }}
            >
                <BrandSection />

            </div>

            {/* Center */}
            <StatusSection />

            {/* Right */}
            <ActionSection />
        </header>
    );
}