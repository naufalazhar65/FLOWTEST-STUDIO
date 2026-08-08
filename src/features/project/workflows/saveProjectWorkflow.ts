import { useFlowStore } from "../../flow/store/useFlowStore";
import { useProjectStore } from "../store/useProjectStore";

import { saveProject } from "../services/fileSystem/saveProject";
import { saveProjectAs } from "../services/fileSystem/saveProjectAs";

export async function saveProjectWorkflow() {
    const projectStore =
        useProjectStore.getState();

    const flowStore =
        useFlowStore.getState();

    const handle =
        projectStore.fileHandle;

    // Belum pernah disimpan sebelumnya.
    // Arahkan ke Save As.
    if (!handle) {
        return saveProjectAsWorkflow();
    }

    const project =
        flowStore.saveProject(
            projectStore.name.replace(
                /\.flow$/i,
                "",
            ),
        );

    await saveProject(
        handle,
        project,
    );

    projectStore.markSaved();

    return true;
}

export async function saveProjectAsWorkflow() {
    const projectStore =
        useProjectStore.getState();

    const flowStore =
        useFlowStore.getState();

    const project =
        flowStore.saveProject(
            projectStore.name.replace(
                /\.flow$/i,
                "",
            ),
        );

    const handle =
        await saveProjectAs(project);

    if (!handle) {
        return false;
    }

    projectStore.setFileHandle(
        handle,
    );

    projectStore.setProjectName(
        project.name.endsWith(".flow")
            ? project.name
            : `${project.name}.flow`,
    );

    projectStore.markSaved();

    return true;
}