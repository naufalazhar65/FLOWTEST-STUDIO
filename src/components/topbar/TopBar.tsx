import { BrandSection } from "./BrandSection";
import { StatusSection } from "./StatusSection";
import { ActionSection } from "./ActionSection";

export function TopBar() {
    return (
        <header
            style={{
                height: 60,
                display: "grid",
                gridTemplateColumns: "auto minmax(0, 1fr) auto",
                alignItems: "center",
                columnGap: 16,
                padding: "0 20px",
                boxSizing: "border-box",
                width: "100%",
                minWidth: 0,
                background: "#161B22",
                borderBottom: "1px solid #30363D",
            }}
        >
            {/* Brand */}
            <div
                style={{
                    minWidth: 0,
                    flexShrink: 0,
                }}
            >
                <BrandSection />
            </div>

            {/* Runtime status - flexible middle column */}
            <div
                style={{
                    minWidth: 0,
                    display: "flex",
                    justifyContent: "flex-start",
                    overflow: "hidden",
                }}
            >
                <StatusSection />
            </div>

            {/* Project + execution controls */}
            <div
                style={{
                    minWidth: 0,
                    flexShrink: 0,
                    overflow: "hidden",
                }}
            >
                <ActionSection />
            </div>
        </header>
    );
}