import type { FlowProject } from "../types/FlowProject";
import { download } from "./download";

export function exportProject(
  project: FlowProject
) {
  download(
    `${project.name}.flow.json`,
    JSON.stringify(
      project,
      null,
      2
    )
  );
}