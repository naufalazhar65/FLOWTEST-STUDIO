import type {
    DeviceProfile,
} from "./DeviceProfile";

import type {
    EnvironmentVariable,
} from "./EnvironmentVariable";

export type EnvironmentName =
    | "local"
    | "development"
    | "staging"
    | "production";

export interface EnvironmentProfile {
    name: EnvironmentName;

    variables: Record<
        string,
        EnvironmentVariable
    >;

    deviceProfile?:
        DeviceProfile;
}