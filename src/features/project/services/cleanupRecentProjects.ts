import type {
    RecentProject,
} from "../types/RecentProject";

import {
    getRecentProjects,
    removeRecentProject,
} from "../storage/db/projects";

export async function cleanupDuplicateRecentProjects(): Promise<number> {
    const projects =
        await getRecentProjects();

    // Pastikan project yang paling baru dibuka
    // diproses terlebih dahulu.
    projects.sort(
        (a, b) =>
            new Date(
                b.lastOpened,
            ).getTime() -
            new Date(
                a.lastOpened,
            ).getTime(),
    );

    const kept: RecentProject[] =
        [];

    const duplicates: RecentProject[] =
        [];

    for (const project of projects) {
        let isDuplicate = false;

        for (const existing of kept) {
            try {
                if (
                    await project.handle.isSameEntry(
                        existing.handle,
                    )
                ) {
                    isDuplicate = true;
                    break;
                }
            } catch {
                // Jika handle tidak bisa dibandingkan,
                // jangan hapus record tersebut.
                isDuplicate = false;
                break;
            }
        }

        if (isDuplicate) {
            duplicates.push(project);
        } else {
            kept.push(project);
        }
    }

    for (const project of duplicates) {
        await removeRecentProject(
            project.id,
        );
    }

    return duplicates.length;
}