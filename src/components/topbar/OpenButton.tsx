import { FolderOpen } from "lucide-react";

import { Button } from "../ui/Button";

import {
    openProjectWorkflow,
} from "../../features/project/services/openProjectWorkflow";

export function OpenButton() {
    return (
        <Button
            variant="secondary"
            onClick={() => {
                void openProjectWorkflow();
            }}
        >
            <FolderOpen size={16} />
            Open
        </Button>
    );
}