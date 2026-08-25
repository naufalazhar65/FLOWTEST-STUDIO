import type {
    EnvironmentProfile,
} from "../types/EnvironmentProfile";

export const defaultEnvironments:
    EnvironmentProfile[] = [
        {
            name: "local",

            variables: {},
        },

        {
            name:
                "development",

            variables: {},
        },

        {
            name: "staging",

            variables: {},
        },

        {
            name:
                "production",

            variables: {},
        },
    ];