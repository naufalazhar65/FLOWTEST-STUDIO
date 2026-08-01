import type { FlowProject } from "../../../flow/types/FlowProject";

import { download } from "./download";

export function downloadProject(
    project: FlowProject,
) {
    download(
        `${project.name}.flow.json`,
        JSON.stringify(
            project,
            null,
            2,
        ),
    );
}