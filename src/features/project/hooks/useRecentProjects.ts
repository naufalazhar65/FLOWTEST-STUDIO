import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type {
    RecentProject,
} from "../types/RecentProject";

import {
    getRecentProjects,
} from "../storage/db/projects";

import {
    subscribeToRecentProjectsUpdated,
} from "../services/recentProjectsEvents";

export function useRecentProjects() {
    const [
        projects,
        setProjects,
    ] = useState<
        RecentProject[]
    >([]);

    const refresh = useCallback(
        async () => {
            try {
                const recent =
                    await getRecentProjects();

                recent.sort(
                    (a, b) =>
                        new Date(
                            b.lastOpened,
                        ).getTime() -
                        new Date(
                            a.lastOpened,
                        ).getTime(),
                );

                setProjects(
                    recent.slice(0, 10),
                );
            } catch (error) {
                console.error(
                    "Failed to load recent projects:",
                    error,
                );

                setProjects([]);
            }
        },
        [],
    );

    useEffect(() => {
        void refresh();

        return subscribeToRecentProjectsUpdated(
            () => {
                void refresh();
            },
        );
    }, [refresh]);

    return projects;
}