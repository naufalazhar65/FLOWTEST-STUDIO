import { Save } from "lucide-react";

import { Button } from "../ui/Button";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { useProjectStore } from "../../features/project/store/useProjectStore";

import { exportProject } from "../../features/flow/services/exportService";

export function SaveButton() {
    const projectName = useProjectStore(
        (state) => state.name,
    );
    const saveProject = useFlowStore(
        (state) => state.saveProject,
    );

    const markSaved = useProjectStore(
        (state) => state.markSaved,
    );

    function handleSave() {
        exportProject(
            saveProject(projectName.replace(".flow", "")),
        );

        markSaved();
    }

    return (
        <Button onClick={handleSave}>
            <Save size={16} />
            Save
        </Button>
    );
}