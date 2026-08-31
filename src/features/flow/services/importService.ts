import type { FlowProject } from "../types/FlowProject";

import { deserializeProject } from "../../project/services/flowFileFormat";

export async function importProject(
  file: File
): Promise<FlowProject> {
  const text =
    await file.text();

  return deserializeProject(text);
}