import { WelcomeScreen } from "../features/workspace/components/WelcomeScreen";
import { WorkspaceView } from "../features/workspace/components/WorkspaceView";

import { useWorkspaceStore } from "../features/workspace/store/useWorkspaceStore";

export function AppRouter() {
    const mode = useWorkspaceStore(
        (state) => state.mode,
    );

    switch (mode) {
        case "workspace":
            return <WorkspaceView />;

        case "welcome":
        default:
            return <WelcomeScreen />;
    }
}