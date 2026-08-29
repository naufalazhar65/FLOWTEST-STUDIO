import {
    useState,
} from "react";

import type {
    LastSession,
} from "../storage/sessions";

import {
    getLastSession,
} from "../storage/sessions";

export function useLastSession() {
    const [
        session,
    ] = useState<LastSession | null>(
        () => getLastSession(),
    );

    return session;
}