import { MainLayout } from "../../../components/layout/MainLayout";

import { ReportsPage } from "../../reports/components/ReportsPage";
import { TestSuitesPage } from "../../suites/components/TestSuitesPage";

import { DeviceManager } from "../../device/components/DeviceManager";

import { useWorkspaceStore } from "../store/useWorkspaceStore";

export function WorkspaceView() {
    const view = useWorkspaceStore(
        (state) => state.view,
    );

    switch (view) {
        case "suites":
            return <TestSuitesPage />;

        case "reports":
            return <ReportsPage />;

        case "devices":
            return <DeviceManager />;

        case "flow":
        default:
            return <MainLayout />;
    }
}