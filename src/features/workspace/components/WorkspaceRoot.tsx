import { MainLayout } from "../../../components/layout/MainLayout";
import { WelcomeScreen } from "./WelcomeScreen";

import { CreateProjectDialog } from "../dialogs/CreateProjectDialog";

import { useWorkspaceStore } from "../store/useWorkspaceStore";

export function WorkspaceRouter() {
    const mode = useWorkspaceStore(
        (state) => state.mode,
    );

    return (
        <>
            {mode === "workspace" ? (
                <MainLayout />
            ) : (
                <WelcomeScreen />
            )}

            <CreateProjectDialog />
        </>
    );
}