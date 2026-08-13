const RECENT_PROJECTS_UPDATED =
    "flowtest:recent-projects-updated";

export function notifyRecentProjectsUpdated() {
    window.dispatchEvent(
        new Event(
            RECENT_PROJECTS_UPDATED,
        ),
    );
}

export function subscribeToRecentProjectsUpdated(
    callback: () => void,
) {
    window.addEventListener(
        RECENT_PROJECTS_UPDATED,
        callback,
    );

    return () => {
        window.removeEventListener(
            RECENT_PROJECTS_UPDATED,
            callback,
        );
    };
}