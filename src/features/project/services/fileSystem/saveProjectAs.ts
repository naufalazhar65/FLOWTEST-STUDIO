import type { FlowProject } from "../../../flow/types/FlowProject";

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
            JSON.stringify(
                project,
                null,
                2,
            ),
        );

        await writable.close();

        return handle;
    } catch {
        return null;
    }
}