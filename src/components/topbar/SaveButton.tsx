import { Save } from "lucide-react";

import { Button } from "../ui/Button";

import {
    saveProjectWorkflow,
} from "../../features/project/workflows/saveProjectWorkflow";

export function SaveButton() {
    return (
        <Button
            variant="secondary"
            onClick={() => {
                void saveProjectWorkflow();
            }}
        >
            <Save size={16} />
            Save
        </Button>
    );
}