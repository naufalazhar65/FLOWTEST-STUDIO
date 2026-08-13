import {
    FolderOpen,
    Plus,
} from "lucide-react";

import {
    spacing,
} from "../../../themes";

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

                alignItems: "stretch",

                justifyContent:
                    "center",

                gap: spacing.lg,

                flexWrap: "wrap",

                width: "100%",

                padding:
                    `0 ${spacing.sm}px`,

                boxSizing:
                    "border-box",
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