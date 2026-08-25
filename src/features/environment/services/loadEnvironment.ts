import {
    setVariable,
    clearVariables,
} from "../../execution/variables/VariableStore";

import {
    useAppiumConfigStore,
} from "../../execution/store/useAppiumConfigStore";

import type {
    EnvironmentProfile,
} from "../types/EnvironmentProfile";

export function loadEnvironment(
    environment:
        EnvironmentProfile,
): void {
    /*
     * An environment represents the complete
     * runtime variable set for the execution.
     *
     * Remove variables from the previous
     * environment before loading the new one.
     */
    clearVariables();

    for (
        const [
            name,
            variable,
        ] of Object.entries(
            environment.variables,
        )
    ) {
        setVariable(
            name,
            variable.value,
        );
    }

    /*
     * Device profile is optional.
     *
     * When it is not provided, preserve the
     * currently selected Appium configuration.
     */
    if (
        !environment.deviceProfile
    ) {
        return;
    }

    const profile =
        environment.deviceProfile;

    const platformKey =
        profile.platformName ===
        "Android"
            ? "android"
            : "ios";

    useAppiumConfigStore
        .getState()
        .updateConfig({
            platformName:
                profile.platformName,
        });

    useAppiumConfigStore
        .getState()
        .updateDevice(
            platformKey,
            {
                deviceName:
                    profile.deviceName,

                platformVersion:
                    profile.platformVersion,

                udid:
                    profile.udid,
            },
        );
}