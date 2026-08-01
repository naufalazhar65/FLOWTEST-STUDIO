import { Save } from "lucide-react";

import { Button } from "../ui/Button";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { exportProject } from "../../features/flow/services/exportService";

export function SaveButton() {
    const saveProject = useFlowStore(
        (state) => state.saveProject,
    );

    function handleSave() {
        exportProject(
            saveProject("Untitled"),
        );
    }

    return (
        <Button onClick={handleSave}>
            <Save size={16} />
            Save
        </Button>
    );
}