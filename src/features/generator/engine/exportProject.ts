import type { GeneratedProject } from "../types/GeneratedProject";

export function exportProject(
    project: GeneratedProject,
) {
    return project.files;
}