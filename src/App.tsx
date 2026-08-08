import { ReactFlowProvider } from "reactflow";

import { Studio } from "./pages/Studio";

import {
    useCommandShortcuts,
} from "./features/command/hooks/useCommandShortcuts";

import {
    useRestoreProject,
} from "./features/project/hooks/useRestoreProject";

function App() {
    useCommandShortcuts();

    useRestoreProject();

    return (
        <ReactFlowProvider>
            <Studio />
        </ReactFlowProvider>
    );
}

export default App;