import {
    useEffect,
    useState,
} from "react";

import type {
    RecentProject,
} from "../types/RecentProject";

import {
    getRecentProjects,
} from "../storage/db/projects";

export function useRecentProjects() {
    const [
        projects,
        setProjects,
    ] = useState<
        RecentProject[]
    >([]);

    useEffect(() => {
        void getRecentProjects().then(
            setProjects,
        );
    }, []);

    return projects;
}