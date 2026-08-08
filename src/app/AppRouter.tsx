import { MainLayout } from "../components/layout/MainLayout";

import { WelcomeScreen } from "../features/workspace/components/WelcomeScreen";

import { useWorkspaceStore } from "../features/workspace/store/useWorkspaceStore";

export function AppRouter() {
    const mode = useWorkspaceStore(
        (state) => state.mode,
    );

    switch (mode) {
        case "workspace":
            return <MainLayout />;

        case "welcome":
        default:
            return <WelcomeScreen />;
    }
}