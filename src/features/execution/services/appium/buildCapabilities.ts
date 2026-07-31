import { useAppiumConfigStore } from "../../store/useAppiumConfigStore";

export interface LaunchCapabilities {
    // Android
    appPackage?: string;
    appActivity?: string;

    // iOS
    bundleId?: string;
    app?: string;

    // Shared
    noReset: boolean;
}

export function buildCapabilities(
    launch: LaunchCapabilities,
) {
    const config =
        useAppiumConfigStore.getState().config;

    const capabilities: Record<string, unknown> = {
        platformName: config.platformName,

        "appium:automationName":
            config.automationName,

        "appium:deviceName":
            config.deviceName,

        "appium:noReset":
            launch.noReset,
    };

    if (config.platformVersion) {
        capabilities[
            "appium:platformVersion"
        ] = config.platformVersion;
    }

    if (config.udid) {
        capabilities["appium:udid"] =
            config.udid;
    }

    if (config.platformName === "Android") {
        if (launch.appPackage) {
            capabilities["appium:appPackage"] =
                launch.appPackage;
        }

        if (launch.appActivity) {
            capabilities["appium:appActivity"] =
                launch.appActivity;
        }
    }

    if (config.platformName === "iOS") {
        if (launch.app) {
            capabilities["appium:app"] =
                launch.app;
        } else if (launch.bundleId) {
            capabilities["appium:bundleId"] =
                launch.bundleId;
        }
    }

    return capabilities;
}