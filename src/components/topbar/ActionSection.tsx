import { ToolbarGroup } from "../ui/ToolbarGroup";

import { OpenButton } from "./OpenButton";
import { SaveButton } from "./SaveButton";
import { RunButton } from "./RunButton";

export function ActionSection() {
    return (
        <div className="flex items-center gap-3">

            <ToolbarGroup>
                <OpenButton />
                <SaveButton />
            </ToolbarGroup>

            <div className="h-7 w-px bg-neutral-700" />

            <ToolbarGroup>
                <RunButton />
            </ToolbarGroup>

        </div>
    );
}