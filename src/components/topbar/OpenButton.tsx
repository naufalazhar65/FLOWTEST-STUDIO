import { FolderOpen } from "lucide-react";

import { Button } from "../ui/Button";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { useProjectStore } from "../../features/project/store/useProjectStore";

import { importProject } from "../../features/flow/services/importService";
import { openProject } from "../../features/project/services/fileSystem/openProject";

export function OpenButton() {
    const loadProject = useFlowStore(
        (state) => state.loadProject,
    );

    const setProjectName = useProjectStore(
        (state) => state.setProjectName,
    );

    const setFileHandle = useProjectStore(
        (state) => state.setFileHandle,
    );

    const markSaved = useProjectStore(
        (state) => state.markSaved,
    );

    async function handleOpen() {
        const result = await openProject();

        if (!result) {
            return;
        }

        const project = await importProject(
            result.file,
        );

        loadProject(project);

        setProjectName(
            result.file.name.replace(
                /\.json$/i,
                ".flow",
            ),
        );

        setFileHandle(
            result.handle,
        );

        markSaved();
    }

    return (
        <Button
            variant="secondary"
            onClick={handleOpen}
        >
            <FolderOpen size={16} />
            Open
        </Button>
    );
}