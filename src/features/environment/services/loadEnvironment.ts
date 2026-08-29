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

export interface LoadEnvironmentOptions {
    /*
     * When true, the device configuration
     * currently set in the Appium config
     * store (e.g. the device selected and
     * connected in the Device Manager) is
     * preserved even if the environment
     * declares a device profile.
     */
    preserveDeviceConfig?:
    boolean;
}

export function loadEnvironment(
    environment:
        EnvironmentProfile,
    options?:
        LoadEnvironmentOptions,
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
     * A device selected in the Device Manager
     * wins over the environment's device
     * profile so a connected device is never
     * silently replaced by a stale profile.
     */
    if (
        options?.preserveDeviceConfig
    ) {
        return;
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