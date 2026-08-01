import { ProjectBadge } from "./ProjectBadge";

import { useProjectStore } from "../../features/project/store/useProjectStore";

export function WorkspaceSection() {
    const name = useProjectStore(
        (state) => state.name,
    );

    const modified = useProjectStore(
        (state) => state.isModified,
    );

    return (
        <ProjectBadge
            name={name}
            modified={modified}
        />
    );
}