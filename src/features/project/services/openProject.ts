import type { FlowProject } from "../../../features/flow/types/FlowProject";

import { deserializeProject } from "./flowFileFormat";

export interface OpenProjectResult {
    project: FlowProject;
    file: File;
    handle: FileSystemFileHandle;
}

export async function openProject(): Promise<
    OpenProjectResult | null
> {
    if (
        !("showOpenFilePicker" in window)
    ) {
        alert(
            "Your browser does not support File System Access API.",
        );

        return null;
    }

    try {
        const [handle] =
            await window.showOpenFilePicker({
                multiple: false,

                types: [
                    {
                        description:
                            "FlowTest Studio Project",

                        accept: {
                            "application/json": [
                                ".flow",
                            ],
                        },
                    },
                ],
            });

        const file =
            await handle.getFile();

        const text =
            await file.text();

        const project =
            deserializeProject(
                text,
            );

        return {
            project,
            file,
            handle,
        };
    } catch {
        return null;
    }
}