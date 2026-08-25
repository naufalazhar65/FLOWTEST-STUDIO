import {
    useEnvironmentStore,
} from "../store/useEnvironmentStore";

import {
    loadEnvironment,
} from "./loadEnvironment";

import type {
    EnvironmentName,
} from "../types/EnvironmentProfile";

export function loadEnvironmentByName(
    name: EnvironmentName,
): void {
    const environment =
        useEnvironmentStore
            .getState()
            .environments.find(
                (
                    profile,
                ) =>
                    profile.name ===
                    name,
            );

    if (!environment) {
        throw new Error(
            `Environment "${name}" was not found.`,
        );
    }

    loadEnvironment(
        environment,
    );
}