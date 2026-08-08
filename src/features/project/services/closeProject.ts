import { useExecutionStore } from "../../execution/store/useExecutionStore";
import { useFlowStore } from "../../flow/store/useFlowStore";
import { useProjectStore } from "../store/useProjectStore";
import { useWorkspaceStore } from "../../workspace/store/useWorkspaceStore";

import {
    clearActiveProject,
} from "../storage/activeProject";

export function closeProject() {
    clearActiveProject();

    useExecutionStore
        .getState()
        .reset();

    useFlowStore
        .getState()
        .resetFlow();

    useProjectStore
        .getState()
        .reset();

    useWorkspaceStore
        .getState()
        .showWelcome();
}