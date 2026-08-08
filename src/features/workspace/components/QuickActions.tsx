import {
    FolderOpen,
    Plus,
} from "lucide-react";

import { ActionCard } from "../../../components/ui/ActionCard";

import { useWorkspaceStore } from "../store/useWorkspaceStore";

import {
    openProjectWorkflow,
} from "../../project/services/openProjectWorkflow";

export function QuickActions() {
    const openCreateProject =
        useWorkspaceStore(
            (state) =>
                state.openCreateProject,
        );

    return (
        <div
            style={{
                display: "flex",

                justifyContent: "center",

                gap: 24,

                flexWrap: "wrap",
            }}
        >
            <ActionCard
                icon={
                    <Plus size={28} />
                }
                title="Create Project"
                description="Create a new FlowTest Studio project."
                shortcut="⌘ N"
                onClick={
                    openCreateProject
                }
            />

            <ActionCard
                icon={
                    <FolderOpen
                        size={28}
                    />
                }
                title="Open Project"
                description="Open an existing FlowTest Studio project."
                shortcut="⌘ O"
                onClick={() => {
                    void openProjectWorkflow();
                }}
            />
        </div>
    );
}