import type { FlowProject } from "../../../flow/types/FlowProject";

import { serializeProject } from "../flowFileFormat";

import { download } from "./download";

export function downloadProject(
    project: FlowProject,
) {
    download(
        `${project.name}.flow.json`,
        serializeProject(project),
    );
}