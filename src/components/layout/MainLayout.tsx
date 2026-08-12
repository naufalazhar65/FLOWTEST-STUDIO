import { useEffect, useState } from "react";

import { TopBar } from "../topbar/TopBar";
import { Sidebar } from "../sidebar/Sidebar";
import { ConsolePanel } from "../console/ConsolePanel";
import { StatusBar } from "../statusbar/StatusBar";
import { RightPanel } from "../rightpanel/RightPanel";

import { Toolbar } from "../../features/flow/components/toolbar/Toolbar";
import { FlowCanvas } from "../../features/flow/components/canvas/FlowCanvas";
import { ExecutionBar } from "../../features/execution/components/ExecutionBar";

import { appiumConnectionService } from "../../features/execution/services/appium/AppiumConnectionService";

import { useWorkspaceStore } from "../../features/workspace/store/useWorkspaceStore";

import { ReportsPage } from "../../features/reports/components/ReportsPage";
import { DeviceManager } from "../../features/device/components/DeviceManager";

export function MainLayout() {
    useEffect(() => {
        appiumConnectionService.start();

        return () => {
            appiumConnectionService.stop();
        };
    }, []);

    const [consoleExpanded, setConsoleExpanded] =
        useState(false);

    const view = useWorkspaceStore(
        (state) => state.view,
    );

    return (
        <div
            style={{
                height: "100vh",

                display: "grid",

                gridTemplateRows: `auto 1fr ${consoleExpanded
                    ? "220px"
                    : "48px"
                    } 32px`,

                background: "#0D1117",

                overflow: "hidden",
            }}
        >
            <TopBar />

            {/* Main Area */}
            <div
                style={{
                    display: "grid",

                    gridTemplateColumns:
                        view === "reports" ||
                            view === "devices"
                            ? "300px minmax(0, 1fr)"
                            : "300px minmax(0, 1fr) 420px",

                    minHeight: 0,

                    overflow: "hidden",
                }}
            >
                {/* Sidebar */}
                <div
                    style={{
                        minHeight: 0,

                        display: "flex",

                        flexDirection: "column",

                        overflow: "hidden",
                    }}
                >
                    <Sidebar />
                </div>

                {/* Workspace Content */}
                <div
                    style={{
                        display: "flex",

                        flexDirection: "column",

                        minHeight: 0,

                        overflow: "hidden",

                        background: "#0D1117",
                    }}
                >
                    {view === "reports" ? (
                        <ReportsPage />
                    ) : view === "devices" ? (
                        <DeviceManager />
                    ) : (
                        <>
                            <ExecutionBar />

                            <Toolbar />

                            <div
                                style={{
                                    flex: 1,

                                    minHeight: 0,

                                    overflow: "hidden",
                                }}
                            >
                                <FlowCanvas />
                            </div>
                        </>
                    )}
                </div>

                {/* Inspector */}
                {view === "flow" && (
                    <div
                        style={{
                            display: "flex",

                            flexDirection: "column",

                            minHeight: 0,

                            overflow: "hidden",

                            borderLeft:
                                "1px solid #30363D",

                            background: "#0D1117",
                        }}
                    >
                        <RightPanel />
                    </div>
                )}
            </div>

            <ConsolePanel
                expanded={consoleExpanded}
                onToggle={() =>
                    setConsoleExpanded(
                        (value) => !value,
                    )
                }
            />

            <StatusBar />
        </div>
    );
}