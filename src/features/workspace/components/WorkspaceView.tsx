import { MainLayout } from "../../../components/layout/MainLayout";

import { ReportsPage } from "../../reports/components/ReportsPage";

import { useWorkspaceStore } from "../store/useWorkspaceStore";

export function WorkspaceView() {
    const view = useWorkspaceStore(
        (state) => state.view,
    );

    switch (view) {
        case "reports":
            return <ReportsPage />;

        case "flow":
        default:
            return <MainLayout />;
    }
}