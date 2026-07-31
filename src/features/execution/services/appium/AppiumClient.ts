import { webDriverClient } from "./WebDriverClient";
import { buildCapabilities } from "./buildCapabilities";
import {
  elementService,
  type Rect,
} from "./ElementService";

import type { LocatorStrategy } from "../../types/LocatorStrategy";
import {
  appiumSession,
  type AppiumCapabilities,
} from "./AppiumSession";



export class AppiumClient {


  private getSessionPath(
    path: string,
  ): string {
    return `/session/${appiumSession.getSessionId()
      }${path}`;
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


  private async ensureSession(
    capabilities: AppiumCapabilities,
  ): Promise<void> {
    if (appiumSession.hasSession()) {
      return;
    }

    const response =
      await webDriverClient.post<{
        value: {
          sessionId: string;
          capabilities: AppiumCapabilities;
        };
      }>(
        "/session",
        {
          capabilities: {
            alwaysMatch: capabilities,
          },
        },
      );

    appiumSession.setSessionId(
      response.value.sessionId,
    );

    appiumSession.setCapabilities(
      response.value.capabilities,
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
    launch: {
      appPackage?: string;
      appActivity?: string;

      bundleId?: string;
      app?: string;

      noReset: boolean;
    },
  ): Promise<void> {
    const capabilities =
      buildCapabilities(launch);

    await this.ensureSession(
      capabilities,
    );
  }

  async closeApp(
    options: {
      appPackage?: string;
      bundleId?: string;
    },
  ): Promise<void> {
    const appId =
      options.bundleId ??
      options.appPackage;

    if (!appId) {
      throw new Error(
        "Either appPackage or bundleId is required.",
      );
    }

    await this.sessionPost<void>(
      "/appium/device/terminate_app",
      {
        appId,
      },
    );
  }

  async back(): Promise<void> {
    await this.sessionPost(
      "/back",
      {},
    );
  }

  async home(): Promise<void> {
    await this.sessionPost<void>(
      "/appium/device/press_keycode",
      {
        keycode: 3,
      },
    );
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

    return String(
      capabilities.platformVersion ?? "",
    );
  }

  async getDeviceName(): Promise<string> {
    const capabilities =
      appiumSession.getCapabilities();

    return String(
      capabilities.deviceName ?? "",
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