import type { FlowProject } from "../types/FlowProject";

export async function importProject(
  file: File
): Promise<FlowProject> {
  const text =
    await file.text();

  return JSON.parse(text);
}