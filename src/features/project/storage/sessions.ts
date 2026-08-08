const SESSION_KEY =
    "flowtest.last-session";

export interface LastSession {
    projectId: string;

    lastOpened: string;
}

export function saveLastSession(
    session: LastSession,
) {
    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session),
    );
}

export function getLastSession() {
    const json =
        localStorage.getItem(
            SESSION_KEY,
        );

    if (!json) {
        return null;
    }

    return JSON.parse(
        json,
    ) as LastSession;
}

export function clearLastSession() {
    localStorage.removeItem(
        SESSION_KEY,
    );
}