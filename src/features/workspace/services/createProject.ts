import {
    initialEdges,
    initialNodes,
} from "../../flow/data/initialFlow";

import {
    createProject as createFlowProject,
} from "../../flow/services/projectService";

import {
    useExecutionStore,
} from "../../execution/store/useExecutionStore";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    useGeneratorStore,
} from "../../generator/store/useGeneratorStore";

import {
    useProjectStore,
} from "../../project/store/useProjectStore";

import {
    setActiveProject,
} from "../../project/storage/activeProject";

import {
    useWorkspaceStore,
} from "../store/useWorkspaceStore";

import type {
    CreateProjectOptions,
} from "../types/CreateProjectOptions";

export async function createProject(
    options: CreateProjectOptions,
) {
    // Reset runtime state
    useExecutionStore
        .getState()
        .reset();

    // Clear generated project
    useGeneratorStore
        .getState()
        .clear();

    // Reset project metadata
    const projectStore =
        useProjectStore.getState();

    projectStore.reset();

    // Create new FlowProject
    const project =
        createFlowProject(
            options.name,
            initialNodes,
            initialEdges,
        );

    // Load project into editor
    useFlowStore
        .getState()
        .loadProject(project);

    // Persist active project
    setActiveProject(project);

    // Update metadata
    projectStore.setProjectName(
        `${options.name}.flow`,
    );

    projectStore.markSaved();

    // Enter workspace
    useWorkspaceStore
        .getState()
        .openWorkspace();
}