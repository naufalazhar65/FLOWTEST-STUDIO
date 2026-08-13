import {
    cleanupDuplicateRecentProjects,
} from "./cleanupRecentProjects";

const MIGRATION_KEY =
    "flowtest.recent-projects-cleanup-v1";

export async function runRecentProjectsMigration() {
    if (
        localStorage.getItem(
            MIGRATION_KEY,
        ) === "done"
    ) {
        return;
    }

    try {
        await cleanupDuplicateRecentProjects();

        localStorage.setItem(
            MIGRATION_KEY,
            "done",
        );
    } catch (error) {
        console.error(
            "Failed to cleanup duplicate recent projects:",
            error,
        );
    }
}