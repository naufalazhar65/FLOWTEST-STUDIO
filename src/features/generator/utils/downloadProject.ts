import JSZip from "jszip";

import type { GeneratedProject } from "../types/GeneratedProject";

export async function downloadProject(
    project: GeneratedProject,
) {
    const zip = new JSZip();

    for (const file of project.files) {
        zip.file(
            file.path,
            file.content,
        );
    }

    const blob = await zip.generateAsync({
        type: "blob",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    const now = new Date();

    const filename =
        `flowtest-${now
            .toISOString()
            .replace(/[:.]/g, "-")}.zip`;

    link.download = filename;

    link.click();

    URL.revokeObjectURL(url);
}