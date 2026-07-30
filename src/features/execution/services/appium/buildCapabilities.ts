import { useAppiumConfigStore } from "../../store/useAppiumConfigStore";

export interface LaunchCapabilities {
    appPackage: string;

    appActivity: string;

    noReset: boolean;
}

export function buildCapabilities(
    launch: LaunchCapabilities,
) {
    const config =
        useAppiumConfigStore.getState().config;

    return {
        platformName:
            config.platformName,

        "appium:automationName":
            config.automationName,

        "appium:deviceName":
            config.deviceName,

        ...(config.platformVersion && {
            "appium:platformVersion":
                config.platformVersion,
        }),

        "appium:appPackage":
            launch.appPackage,

        "appium:appActivity":
            launch.appActivity,

        "appium:noReset":
            launch.noReset,
    };
}