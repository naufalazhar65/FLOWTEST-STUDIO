import type { FlowProject } from "../../../flow/types/FlowProject";

import { serializeProject } from "../flowFileFormat";

export async function writeProject(
    handle: FileSystemFileHandle,
    project: FlowProject,
) {
    const writable =
        await handle.createWritable();

    await writable.write(
        serializeProject(project),
    );

    await writable.close();
}
