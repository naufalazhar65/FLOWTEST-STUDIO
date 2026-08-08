import type { RecentProject } from "../types/RecentProject";

const KEY = "flowtest.recent-projects";

export function getRecentProjects(): RecentProject[] {
    const json = localStorage.getItem(KEY);

    if (!json) {
        return [];
    }

    return JSON.parse(json) as RecentProject[];
}

export function saveRecentProjects(
    projects: RecentProject[],
) {
    localStorage.setItem(
        KEY,
        JSON.stringify(projects),
    );
}

export function addRecentProject(
    project: RecentProject,
) {
    const recent =
        getRecentProjects();

    // Hapus project yang sudah ada
    const filtered = recent.filter(
        (item) => item.id !== project.id,
    );

    // Masukkan project yang baru dibuka ke urutan pertama
    filtered.unshift(project);

    // Simpan maksimal 10 project terakhir
    saveRecentProjects(
        filtered.slice(0, 10),
    );
}