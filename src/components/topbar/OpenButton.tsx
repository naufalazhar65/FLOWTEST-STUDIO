import {
    FolderOpen,
} from "lucide-react";

import { Button } from "../ui/Button";

import {
    requestProjectTransition,
} from "../../features/project/services/projectTransition";

export function OpenButton() {
    return (
        <Button
            variant="secondary"
            onClick={() => {
                requestProjectTransition(
                    "open",
                );
            }}
        >
            <FolderOpen size={16} />
            Open
        </Button>
    );
}