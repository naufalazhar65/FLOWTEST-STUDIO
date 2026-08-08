import { ToolbarGroup } from "../ui/ToolbarGroup";

import { ProjectMenu } from "./ProjectMenu";
import { RunButton } from "./RunButton";

import { useProjectStore } from "../../features/project/store/useProjectStore";

export function ActionSection() {
    const name = useProjectStore(
        (state) => state.name,
    );

    const modified = useProjectStore(
        (state) => state.isModified,
    );

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}
        >
            {/* Project */}
            <ToolbarGroup>
                <ProjectMenu
                    name={name}
                    modified={modified}
                />
            </ToolbarGroup>

            {/* Divider */}
            <div
                style={{
                    width: 1,
                    height: 24,
                    margin: "0 2px",
                    background: "#30363D",
                }}
            />

            {/* Run */}
            <ToolbarGroup>
                <RunButton />
            </ToolbarGroup>
        </div>
    );
}