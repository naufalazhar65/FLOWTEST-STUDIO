import {
    useEnvironmentStore,
} from "../store/useEnvironmentStore";

import {
    loadEnvironment,
} from "./loadEnvironment";

export function loadActiveEnvironment():
    void {
    const environment =
        useEnvironmentStore
            .getState()
            .getActiveEnvironment();

    if (
        !environment
    ) {
        throw new Error(
            "Active environment could not be resolved.",
        );
    }

    loadEnvironment(
        environment,
    );
}