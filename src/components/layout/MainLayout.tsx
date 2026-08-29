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
import { TestSuitesPage } from "../../features/suites/components/TestSuitesPage";

export function MainLayout() {
    useEffect(() => {
        appiumConnectionService.start();
        return () => {
            appiumConnectionService.stop();
        };
    }, []);

    const [consoleExpanded, setConsoleExpanded] = useState(false);
    const view = useWorkspaceStore((state) => state.view);

    const isFlowView = view === "flow";
    const isFullWorkspaceView = view === "reports" || view === "devices" || view === "suites";

    return (
        <div className="h-screen grid bg-[#0D1117] overflow-hidden"
            style={{ gridTemplateRows: `auto 1fr ${consoleExpanded ? "220px" : "48px"} 32px` }}>
            <TopBar />

            {/* Main Area */}
            <div className={`grid min-h-0 overflow-hidden ${isFullWorkspaceView ? "grid-cols-[300px_1fr]" : "grid-cols-[300px_1fr_420px]"
                }`}>
                {/* Sidebar */}
                <div className="min-h-0 flex flex-col overflow-hidden">
                    <Sidebar />
                </div>

                {/* Workspace Content */}
                <div className="flex flex-col min-h-0 overflow-hidden bg-[#0D1117]">
                    {view === "suites" ? (
                        <TestSuitesPage />
                    ) : view === "reports" ? (
                        <ReportsPage />
                    ) : view === "devices" ? (
                        <DeviceManager />
                    ) : (
                        <>
                            <ExecutionBar />
                            <Toolbar />
                            <div className="flex-1 min-h-0 overflow-hidden">
                                <FlowCanvas />
                            </div>
                        </>
                    )}
                </div>

                {/* Inspector */}
                {isFlowView && (
                    <div className="flex flex-col min-h-0 overflow-hidden border-l border-[#30363D] bg-[#0D1117]">
                        <RightPanel />
                    </div>
                )}
            </div>

            <ConsolePanel expanded={consoleExpanded} onToggle={() => setConsoleExpanded((v) => !v)} />
            <StatusBar />
        </div>
    );
}