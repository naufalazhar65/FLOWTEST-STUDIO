import {
    useEffect,
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
        setSession,
    ] = useState<LastSession | null>(
        null,
    );

    useEffect(() => {
        setSession(
            getLastSession(),
        );
    }, []);

    return session;
}