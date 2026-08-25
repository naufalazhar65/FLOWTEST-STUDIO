import {
    create,
} from "zustand";

import {
    persist,
} from "zustand/middleware";

import {
    defaultEnvironments,
} from "../data/defaultEnvironments";

import type {
    EnvironmentName,
    EnvironmentProfile,
} from "../types/EnvironmentProfile";

import type {
    EnvironmentVariable,
} from "../types/EnvironmentVariable";

interface EnvironmentStore {
    activeEnvironment:
    EnvironmentName;

    environments:
    EnvironmentProfile[];

    setActiveEnvironment(
        name: EnvironmentName,
    ): void;

    updateEnvironment(
        profile: EnvironmentProfile,
    ): void;

    getActiveEnvironment():
        EnvironmentProfile | undefined;

    resetEnvironments(): void;
}

interface PersistedEnvironmentState {
    activeEnvironment?:
    EnvironmentName;

    environments?:
    Array<
        {
            name: EnvironmentName;

            variables?: Record<
                string,
                unknown
            >;

            deviceProfile?:
            EnvironmentProfile["deviceProfile"];
        }
    >;
}

function isEnvironmentVariable(
    value: unknown,
): value is EnvironmentVariable {
    return (
        value !== null &&
        typeof value === "object" &&
        "value" in value &&
        "secret" in value &&
        typeof (
            value as {
                secret?: unknown;
            }
        ).secret ===
        "boolean"
    );
}

function sanitizePersistedVariables(
    variables:
        Record<string, unknown> |
        undefined,
): Record<
    string,
    EnvironmentVariable
> {
    if (!variables) {
        return {};
    }

    return Object.fromEntries(
        Object.entries(
            variables,
        ).map(
            ([
                name,
                value,
            ]) => {
                if (
                    isEnvironmentVariable(
                        value,
                    )
                ) {
                    if (
                        value.secret
                    ) {
                        return [
                            name,
                            {
                                secret:
                                    true,
                                value:
                                    "",
                            },
                        ];
                    }

                    return [
                        name,
                        value,
                    ];
                }

                return [
                    name,
                    {
                        value,
                        secret:
                            false,
                    },
                ];
            },
        ),
    );
}

function migrateEnvironmentState(
    persistedState:
        unknown,
): {
    activeEnvironment:
    EnvironmentName;

    environments:
    EnvironmentProfile[];
} {
    const state =
        persistedState as
        | PersistedEnvironmentState
        | undefined;

    const environments =
        state?.environments ??
        defaultEnvironments;

    return {
        activeEnvironment:
            state?.activeEnvironment ??
            "local",

        environments:
            environments.map(
                (
                    environment,
                ) => ({
                    ...environment,

                    variables:
                        sanitizePersistedVariables(
                            environment.variables,
                        ),
                }),
            ),
    };
}

export const useEnvironmentStore =
    create<EnvironmentStore>()(
        persist(
            (set, get) => ({
                activeEnvironment:
                    "local",

                environments:
                    defaultEnvironments,

                setActiveEnvironment(
                    name,
                ) {
                    set({
                        activeEnvironment:
                            name,
                    });
                },

                updateEnvironment(
                    profile,
                ) {
                    set((state) => ({
                        environments:
                            state.environments.map(
                                (
                                    environment,
                                ) =>
                                    environment
                                        .name ===
                                        profile.name
                                        ? profile
                                        : environment,
                            ),
                    }));
                },

                getActiveEnvironment() {
                    const state =
                        get();

                    return state.environments.find(
                        (
                            environment,
                        ) =>
                            environment
                                .name ===
                            state.activeEnvironment,
                    );
                },

                resetEnvironments() {
                    set({
                        activeEnvironment:
                            "local",

                        environments:
                            defaultEnvironments,
                    });
                },
            }),
            {
                name:
                    "flowtest-studio-environments",

                version: 3,

                migrate(
                    persistedState,
                ) {
                    return migrateEnvironmentState(
                        persistedState,
                    );
                },

                partialize(
                    state,
                ) {
                    return {
                        activeEnvironment:
                            state.activeEnvironment,

                        environments:
                            state.environments.map(
                                (
                                    environment,
                                ) => ({
                                    ...environment,

                                    variables:
                                        Object.fromEntries(
                                            Object.entries(
                                                environment.variables,
                                            ).map(
                                                ([
                                                    name,
                                                    variable,
                                                ]) => [
                                                        name,
                                                        variable.secret
                                                            ? {
                                                                secret:
                                                                    true,
                                                            }
                                                            : variable,
                                                    ],
                                            ),
                                        ),
                                }),
                            ),
                    };
                },
            }
        ),
    );