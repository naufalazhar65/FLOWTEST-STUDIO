import { useAppiumConfigStore } from "../../store/useAppiumConfigStore";

export interface LaunchCapabilities {
  platform: "Android" | "iOS";

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

  const device =
    launch.platform === "Android"
      ? config.android
      : config.ios;

  const capabilities: Record<string, unknown> = {
    platformName: launch.platform,

    "appium:automationName":
      launch.platform === "Android"
        ? "UiAutomator2"
        : "XCUITest",

    "appium:deviceName":
      device.deviceName,

    "appium:noReset":
      launch.noReset,
  };

  if (device.platformVersion) {
    capabilities[
      "appium:platformVersion"
    ] = device.platformVersion;
  }

  if (device.udid) {
    capabilities["appium:udid"] =
      device.udid;
  }

  if (launch.platform === "Android") {
    if (launch.appPackage) {
      capabilities["appium:appPackage"] =
        launch.appPackage;
    }

    if (launch.appActivity) {
      capabilities["appium:appActivity"] =
        launch.appActivity;
    }
  }

  if (launch.platform === "iOS") {
    if (launch.bundleId) {
      capabilities["appium:bundleId"] =
        launch.bundleId;
    }

    if (launch.app) {
      capabilities["appium:app"] =
        launch.app;
    }
  }

  return capabilities;
}