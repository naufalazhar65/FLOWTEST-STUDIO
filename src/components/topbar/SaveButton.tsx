import { Save } from "lucide-react";

import { Button } from "../ui/Button";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { useProjectStore } from "../../features/project/store/useProjectStore";

import { saveProject } from "../../features/project/services/fileSystem/saveProject";
import { saveProjectAs } from "../../features/project/services/fileSystem/saveProjectAs";

export function SaveButton() {
    const projectName = useProjectStore(
        (state) => state.name,
    );

    const fileHandle = useProjectStore(
        (state) => state.fileHandle,
    );

    const setFileHandle = useProjectStore(
        (state) => state.setFileHandle,
    );

    const markSaved = useProjectStore(
        (state) => state.markSaved,
    );

    const createProject = useFlowStore(
        (state) => state.saveProject,
    );

    async function handleSave() {
        const project = createProject(
            projectName.replace(/\.flow$/i, ""),
        );

        if (fileHandle) {
            await saveProject(
                fileHandle,
                project,
            );
        } else {
            const handle =
                await saveProjectAs(project);

            if (!handle) {
                return;
            }

            setFileHandle(handle);
        }

        markSaved();
    }

    return (
        <Button
            variant="secondary"
            onClick={handleSave}
        >
            <Save size={16} />
            Save
        </Button>
    );
}