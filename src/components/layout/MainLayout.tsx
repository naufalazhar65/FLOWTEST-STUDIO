import { TopBar } from "../topbar/TopBar";
import { Sidebar } from "../sidebar/Sidebar";
import { FlowCanvas } from "../../features/flow/components/canvas/FlowCanvas";
import { Toolbar } from "../../features/flow/components/toolbar/Toolbar";
import { ConsolePanel } from "../console/ConsolePanel";
import { StatusBar } from "../statusbar/StatusBar";
import { InspectorPanel } from "../inspector/InspectorPanel";

export function MainLayout() {
    return (
        <div
            style={{
                height: "100vh",
                display: "grid",
                gridTemplateRows: "64px 1fr 180px 32px",
                background: "#0d1117",
            }}
        >
            <TopBar />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "300px 1fr 420px",
                    overflow: "hidden",
                }}
            >
                <Sidebar />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <Toolbar />

                    <div
                        style={{
                            flex: 1,
                            overflow: "hidden",
                        }}
                    >
                        <FlowCanvas />
                    </div>
                </div>

                <InspectorPanel />
            </div>

            <ConsolePanel />

            <StatusBar />
            
        </div>
    );
}