import { FolderOpen } from "lucide-react";

import { Button } from "../ui/Button";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { importProject } from "../../features/flow/services/importService";
import { openJsonFile } from "../../features/flow/services/filePicker";

export function OpenButton() {
  const loadProject = useFlowStore(
    (state) => state.loadProject,
  );

  async function handleOpen() {
    const file = await openJsonFile();

    if (!file) {
      return;
    }

    const project =
      await importProject(file);

    loadProject(project);
  }

  return (
    <Button onClick={handleOpen}>
      <FolderOpen size={16} />
      Open
    </Button>
  );
}