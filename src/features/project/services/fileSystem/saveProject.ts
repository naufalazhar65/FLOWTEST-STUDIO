import type { FlowProject } from "../../../flow/types/FlowProject";

export async function saveProject(
    handle: FileSystemFileHandle,
    project: FlowProject,
) {
    const writable =
        await handle.createWritable();

    await writable.write(
        JSON.stringify(
            project,
            null,
            2,
        ),
    );

    await writable.close();
}