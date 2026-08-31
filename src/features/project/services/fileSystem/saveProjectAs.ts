import type { FlowProject } from "../../../flow/types/FlowProject";

import { serializeProject } from "../flowFileFormat";

export async function saveProjectAs(
    project: FlowProject,
): Promise<FileSystemFileHandle | null> {
    try {
        const handle =
            await window.showSaveFilePicker({
                suggestedName: `${project.name}.flow`,

                types: [
                    {
                        description:
                            "FlowTest Project",

                        accept: {
                            "application/json": [
                                ".flow",
                            ],
                        },
                    },
                ],
            });

        const writable =
            await handle.createWritable();

        await writable.write(
            serializeProject(
                project,
            ),
        );

        await writable.close();

        return handle;
    } catch {
        return null;
    }
}