import { webDriverClient } from "./WebDriverClient";
import {
  buildCapabilities,
  type LaunchCapabilities,
} from "./buildCapabilities";

import {
  elementService,
  type Rect,
} from "./ElementService";

import {
  assertValidCapabilities,
} from "./validateCapabilities";

import {
  createAppiumSession,
} from "./createAppiumSession";

import {
  videoRecordingService,
} from "./VideoRecordingService";

import type { LocatorStrategy } from "../../types/LocatorStrategy";
import {
  appiumSession,
  type AppiumCapabilities,
} from "./AppiumSession";
import { createDriver } from "./driver/DriverFactory";
import { gestureService } from "./GestureService";
import { useExecutionStore } from "../../store/useExecutionStore";
import {
  useAppiumConfigStore,
} from "../../store/useAppiumConfigStore";



export class AppiumClient {

  private getDriver(
    platform: "Android" | "iOS",
  ) {
    return createDriver(
      platform,
      this.ensureSession.bind(this),
      this.sessionPost.bind(this),
    );
  }


  private getSessionPath(
    path: string,
  ): string {
    return `/session/${appiumSession.getSessionId()
      }${path}`;
  }



  private async ensureSession(
    capabilities: AppiumCapabilities,
  ): Promise<void> {
    if (appiumSession.hasSession()) {
      const existingCapabilities =
        appiumSession.getCapabilities();

      this.updateExecutionEnvironment(
        existingCapabilities,
        appiumSession.getSessionId(),
      );

      return;
    }

    assertValidCapabilities(
      capabilities,
    );

    const response =
      await createAppiumSession(
        webDriverClient,
        capabilities,
      );

    const sessionId =
      response.sessionId;

    const sessionCapabilities =
      response.capabilities;

    appiumSession.setSessionId(
      sessionId,
    );

    appiumSession.setCapabilities(
      sessionCapabilities,
    );

    this.updateExecutionEnvironment(
      sessionCapabilities,
      sessionId,
    );

    try {
      await videoRecordingService
        .startIfEnabled();
    } catch (error) {
      console.warn(
        "[Video Recording] Failed to start recording.",
        error,
      );
    }
  }

  private updateExecutionEnvironment(
    capabilities: AppiumCapabilities,
    sessionId: string | null,
  ): void {
    const raw =
      capabilities as Record<
        string,
        unknown
      >;

    const platformName =
      String(
        raw.platformName ??
        raw["appium:platformName"] ??
        "",
      ).toLowerCase();

    const platform =
      platformName === "android"
        ? "Android"
        : platformName === "ios"
          ? "iOS"
          : null;

    const osVersion =
      String(
        raw.platformVersion ??
        raw["appium:platformVersion"] ??
        "",
      ) || null;

    const device =
      String(
        raw.deviceName ??
        raw["appium:deviceName"] ??
        "",
      ) || null;

    const automationName =
      String(
        raw.automationName ??
        raw["appium:automationName"] ??
        "",
      ) || null;

    useExecutionStore
      .getState()
      .setEnvironment({
        platform,

        osVersion,

        device,

        automation:
          automationName,

        sessionId,
      });

  }

  private async sessionGet<T>(
    path: string,
  ): Promise<T> {
    const response =
      await webDriverClient.get<{
        value: T;
      }>(
        this.getSessionPath(path),
      );

    return response.value;
  }

  private async sessionPost<T>(
    path: string,
    body: unknown,
  ): Promise<T> {
    const response =
      await webDriverClient.post<{
        value: T;
      }>(
        this.getSessionPath(path),
        body,
      );

    return response.value;
  }

  private async getWindowRect(): Promise<Rect> {
    return this.sessionGet<Rect>(
      "/window/rect",
    );
  }

  private async executeMobileCommand<T = void>(
    command: string,
    args: Record<string, unknown>,
  ): Promise<T> {
    return this.sessionPost<T>(
      "/execute/sync",
      {
        script: `mobile: ${command}`,
        args: [args],
      },
    );
  }

  async connectDevice(): Promise<void> {
    const config =
      useAppiumConfigStore
        .getState()
        .config;

    const device =
      config.platformName ===
        "Android"
        ? config.android
        : config.ios;

    const capabilities: AppiumCapabilities =
    {
      platformName:
        config.platformName,

      "appium:automationName":
        config.platformName ===
          "Android"
          ? "UiAutomator2"
          : "XCUITest",

      "appium:deviceName":
        device.deviceName,

      "appium:noReset":
        false,
    };

    if (device.platformVersion) {
      capabilities[
        "appium:platformVersion"
      ] =
        device.platformVersion;
    }

    if (device.udid) {
      capabilities[
        "appium:udid"
      ] = device.udid;
    }

    await this.ensureSession(
      capabilities,
    );
  }

  async refreshSession(): Promise<void> {
    if (!appiumSession.hasSession()) {
      throw new Error(
        "No active Appium session.",
      );
    }

    const sessionId =
      appiumSession.getSessionId();

    const response =
      await webDriverClient.get<{
        value: AppiumCapabilities;
      }>(
        `/session/${sessionId}`,
      );

    const capabilities =
      response.value;

    appiumSession.setCapabilities(
      capabilities,
    );

    this.updateExecutionEnvironment(
      capabilities,
      sessionId,
    );
  }

  async deleteSession(): Promise<void> {
    if (!appiumSession.hasSession()) {
      return;
    }

    try {
      await webDriverClient.delete(
        this.getSessionPath(""),
      );
    } finally {
      appiumSession.clear();
    }
  }

  async tap(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<void> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    await elementService.click(
      elementId,
    );
  }

  async longPress(
    locatorStrategy: LocatorStrategy,
    locator: string,
    duration: number,
  ): Promise<void> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    await gestureService.longPress(
      elementId,
      duration,
    );
  }

  async doubleTap(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<void> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    await gestureService.doubleTap(
      elementId,
    );
  }

  async drag(
    locatorStrategy: LocatorStrategy,
    locator: string,
    direction:
      | "up"
      | "down"
      | "left"
      | "right",
    distance: number,
    duration: number,
  ): Promise<void> {

    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    await gestureService.drag(
      elementId,
      direction,
      distance,
      duration,
    );
  }

  async pinch(
    locatorStrategy: LocatorStrategy,
    locator: string,
    percent: number,
    duration: number,
  ): Promise<void> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    await gestureService.pinch(
      elementId,
      percent,
      duration,
    );
  }

  async zoom(
    locatorStrategy: LocatorStrategy,
    locator: string,
    percent: number,
    duration: number,
  ): Promise<void> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    await gestureService.zoom(
      elementId,
      percent,
      duration,
    );
  }

  async fling(
    locatorStrategy: LocatorStrategy,
    locator: string,
    direction:
      | "up"
      | "down"
      | "left"
      | "right",
    speed: number,
  ): Promise<void> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    await gestureService.fling(
      elementId,
      direction,
      speed,
    );
  }

  async input(
    locatorStrategy: LocatorStrategy,
    locator: string,
    text: string,
  ): Promise<void> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    await elementService.clear(
      elementId,
    );

    await elementService.sendKeys(
      elementId,
      text,
    );
  }

  async assert(
    locatorStrategy: LocatorStrategy,
    locator: string,
    expected: string,
  ): Promise<void> {
    void locatorStrategy;
    void locator;
    void expected;
  }

  async swipe(
    direction: "up" | "down" | "left" | "right",
    distance: number,
    duration: number,
  ): Promise<void> {
    const rect =
      await this.getWindowRect();

    await this.executeMobileCommand(
      "swipeGesture",
      {
        left: 0,
        top: 0,
        width: rect.width,
        height: rect.height,
        direction,
        percent: distance / 100,
        speed: duration,
      },
    );
  }

  async scroll(
    direction: "up" | "down",
    amount: number,
  ): Promise<void> {
    await this.executeMobileCommand(
      "scrollGesture",
      {
        left: 0,
        top: 0,
        width: 1080,
        height: 2400,
        direction,
        percent: amount / 100,
      },
    );
  }

  async waitUntilElement(
    locatorStrategy: LocatorStrategy,
    locator: string,
    timeout: number,
    pollingInterval: number,
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        const exists =
          await this.elementExists(
            locatorStrategy,
            locator,
          );

        if (exists) {
          return;
        }
      } catch {
        // Retry until timeout.
      }

      await new Promise<void>((resolve) =>
        setTimeout(resolve, pollingInterval),
      );
    }

    throw new Error(
      `Timeout waiting for ${locatorStrategy}=${locator}`,
    );
  }

  async launchApp(
    launch: LaunchCapabilities,
  ): Promise<void> {
    const driver =
      this.getDriver(
        launch.platform,
      );

    const capabilities =
      buildCapabilities(launch);

    await driver.launchApp(
      capabilities,
    );
  }

  async closeApp(
    options: {
      platform: "Android" | "iOS";

      appPackage?: string;
      bundleId?: string;
    },
  ): Promise<void> {
    const driver =
      this.getDriver(options.platform);

    await driver.closeApp(options);
  }

  async back(): Promise<void> {
    const driver =
      this.getDriver("Android");

    await driver.back();
  }

  async home(): Promise<void> {
    const driver =
      this.getDriver("Android");

    await driver.home();
  }

  async hideKeyboard(): Promise<void> {
    try {
      await this.executeMobileCommand(
        "hideKeyboard",
        {},
      );
    } catch {
      // iOS may not provide a dismiss action.
      // Treat this as best-effort.
    }
  }

  async pressReturn(): Promise<void> {
    await this.executeMobileCommand(
      "keys",
      {
        keys: [
          "\uE006",
        ],
      },
    );
  }

  async takeScreenshot(): Promise<string> {
    const response =
      await this.sessionGet<string>(
        "/screenshot",
      );

    return response;
  }

  async getPageSource(): Promise<string> {
    return this.sessionGet<string>("/source");
  }

  async screenshot(
    fileName: string,
  ): Promise<string> {
    void fileName;

    return this.sessionGet<string>(
      "/screenshot",
    );
  }


  async getText(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<string> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    return elementService.getText(
      elementId,
    );
  }

  async elementExists(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<boolean> {
    try {
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

      return true;
    } catch {
      return false;
    }
  }

  async getAttribute(
    locatorStrategy: LocatorStrategy,
    locator: string,
    attribute: string,
  ): Promise<string> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    return elementService.getAttribute(
      elementId,
      attribute,
    );
  }

  async getCurrentActivity(): Promise<string> {
    const sessionId =
      appiumSession.getSessionId();

    const response =
      await webDriverClient.get<{
        value: string;
      }>(
        `/session/${sessionId}/appium/device/current_activity`,
      );

    return response.value;
  }

  async getCurrentPackage(): Promise<string> {
    const sessionId =
      appiumSession.getSessionId();

    const response =
      await webDriverClient.get<{
        value: string;
      }>(
        `/session/${sessionId}/appium/device/current_package`,
      );

    return response.value;
  }

  async getOrientation(): Promise<string> {
    const sessionId =
      appiumSession.getSessionId();

    const response =
      await webDriverClient.get<{
        value: string;
      }>(
        `/session/${sessionId}/orientation`,
      );

    return response.value;
  }

  async getPlatformVersion(): Promise<string> {
    const capabilities =
      appiumSession.getCapabilities();

    const raw =
      capabilities as Record<
        string,
        unknown
      >;

    return String(
      raw.platformVersion ??
      raw["appium:platformVersion"] ??
      "",
    );
  }

  async getDeviceName(): Promise<string> {
    const capabilities =
      appiumSession.getCapabilities();

    const raw =
      capabilities as Record<
        string,
        unknown
      >;

    return String(
      raw.deviceName ??
      raw["appium:deviceName"] ??
      "",
    );
  }

  async getDeviceTime(): Promise<string> {
    const sessionId =
      appiumSession.getSessionId();

    const response =
      await webDriverClient.get<{
        value: string;
      }>(
        `/session/${sessionId}/appium/device/system_time`,
      );

    return response.value;
  }

  async isDisplayed(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<boolean> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    return elementService.isDisplayed(
      elementId,
    );
  }

  async isKeyboardShown(): Promise<boolean> {
    return this.executeMobileCommand<boolean>(
      "isKeyboardShown",
      {},
    );
  }

  async isEnabled(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<boolean> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    return elementService.isEnabled(
      elementId,
    );
  }

  async isSelected(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<boolean> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    return elementService.isSelected(
      elementId,
    );
  }

  async getLocation(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<{
    x: number;
    y: number;
  }> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    const rect =
      await elementService.getRect(
        elementId,
      );

    return {
      x: rect.x,
      y: rect.y,
    };
  }

  async getSize(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<{
    width: number;
    height: number;
  }> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    const rect =
      await elementService.getRect(
        elementId,
      );

    return {
      width: rect.width,
      height: rect.height,
    };
  }

  async getRect(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<Rect> {
    const elementId =
      await elementService.findElement(
        locatorStrategy,
        locator,
      );

    return elementService.getRect(
      elementId,
    );
  }
}

export const appiumClient =
  new AppiumClient();