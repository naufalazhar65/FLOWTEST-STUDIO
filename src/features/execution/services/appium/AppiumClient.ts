import { useExecutionLogStore } from "../../store/useExecutionLogStore";
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


  private logSuccess(
    message: string,
  ): void {
    useExecutionLogStore
      .getState()
      .addLog(
        "success",
        message,
      );
  }

  private logError(
    error: unknown,
    fallback: string,
  ): never {
    useExecutionLogStore
      .getState()
      .addLog(
        "error",
        error instanceof Error
          ? error.message
          : fallback,
      );

    throw error;
  }

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

      this.logSuccess(
        "Appium session closed",
      );
    } catch (error) {
      this.logError(
        error,
        "Failed to close Appium session",
      );
    } finally {
      appiumSession.clear();
    }
  }
  async tap(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<void> {
    try {
      const elementId =
        await elementService.findElement(
          locatorStrategy,
          locator,
        );

      await elementService.click(
        elementId,
      );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Tapped ${locatorStrategy}=${locator}`,
        );
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to tap element",
        );

      throw error;
    }
  }

  async input(
    locatorStrategy: LocatorStrategy,
    locator: string,
    text: string,
  ): Promise<void> {
    try {
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

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Input "${text}"`,
        );
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to input text",
        );

      throw error;
    }
  }

  async assert(
    locatorStrategy: LocatorStrategy,
    locator: string,
    expected: string
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "success",
        `Assert ${locatorStrategy}=${locator} == ${expected}`
      );

  }

  async swipe(
    direction: "up" | "down" | "left" | "right",
    distance: number,
    duration: number,
  ): Promise<void> {
    try {

      const rect = await this.getWindowRect();

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

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Swipe ${direction}`,
        );
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to swipe",
        );

      throw error;
    }
  }

  async scroll(
    direction: "up" | "down",
    amount: number,
  ): Promise<void> {
    try {
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

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Scroll ${direction}`,
        );
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to scroll",
        );

      throw error;
    }
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
          useExecutionLogStore
            .getState()
            .addLog(
              "success",
              `Element found: ${locatorStrategy}=${locator}`,
            );

          return;
        }
      } catch {
        // Retry until timeout.
      }

      await new Promise<void>((resolve) =>
        setTimeout(resolve, pollingInterval),
      );
    }

    const message =
      `Timeout waiting for ${locatorStrategy}=${locator}`;

    useExecutionLogStore
      .getState()
      .addLog(
        "error",
        message,
      );

    throw new Error(message);
  }

  async launchApp(
    appPackage: string,
    appActivity: string,
    noReset: boolean,
  ) {
    try {
      const capabilities =
        buildCapabilities({
          appPackage,
          appActivity,
          noReset,
        });

      await this.ensureSession(
        capabilities,
      );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          "Appium session started",
        );
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to create Appium session",
        );

      throw error;
    }
  }

  async closeApp(
    appPackage: string,
  ): Promise<void> {
    try {
      await this.sessionPost<void>(
        "/appium/device/terminate_app",
        {
          appId: appPackage,
        },
      );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Closed app: ${appPackage}`,
        );
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to close app",
        );

      throw error;
    }
  }

  async back(): Promise<void> {
    try {
      await this.sessionPost(
        "/back",
        {},
      );

      this.logSuccess(
        "Pressed Back",
      );
    } catch (error) {
      this.logError(
        error,
        "Failed to press Back",
      );
    }
  }

  async home(): Promise<void> {
    try {
      await this.sessionPost<void>(
        "/appium/device/press_keycode",
        {
          keycode: 3,
        },
      );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          "Pressed Home",
        );
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to press Home",
        );

      throw error;
    }
  }

  async screenshot(
    fileName: string,
  ): Promise<string> {
    try {
      const base64 =
        await this.sessionGet<string>(
          "/screenshot",
        );

      this.logSuccess(
        `Screenshot captured: ${fileName}`,
      );

      return base64;
    } catch (error) {
      this.logError(
        error,
        "Failed to capture screenshot",
      );
    }
  }


  async getText(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<string> {
    try {
      const elementId =
        await elementService.findElement(
          locatorStrategy,
          locator,
        );

      const text =
        await elementService.getText(
          elementId,
        );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Text: ${text}`,
        );

      return text;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to get text",
        );

      throw error;
    }
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

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          "Element found",
        );

      return true;
    } catch {
      useExecutionLogStore
        .getState()
        .addLog(
          "info",
          "Element not found",
        );

      return false;
    }
  }

  async getAttribute(
    locatorStrategy: LocatorStrategy,
    locator: string,
    attribute: string,
  ): Promise<string> {
    try {
      const elementId =
        await elementService.findElement(
          locatorStrategy,
          locator,
        );

      const value =
        await elementService.getAttribute(
          elementId,
          attribute,
        );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `${attribute}: ${value}`,
        );

      return value;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to get attribute",
        );

      throw error;
    }
  }

  async getCurrentActivity(): Promise<string> {
    try {
      const sessionId = appiumSession.getSessionId();

      const response =
        await webDriverClient.get<{
          value: string;
        }>(
          `/session/${sessionId}/appium/device/current_activity`,
        );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Current Activity: ${response.value}`,
        );

      return response.value;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to get current activity",
        );

      throw error;
    }
  }

  async getCurrentPackage(): Promise<string> {
    try {
      const sessionId = appiumSession.getSessionId();

      const response =
        await webDriverClient.get<{
          value: string;
        }>(
          `/session/${sessionId}/appium/device/current_package`,
        );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Current Package: ${response.value}`,
        );

      return response.value;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to get current package",
        );

      throw error;
    }
  }

  async getOrientation(): Promise<string> {
    try {
      const sessionId = appiumSession.getSessionId();

      const response =
        await webDriverClient.get<{
          value: string;
        }>(
          `/session/${sessionId}/orientation`,
        );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Orientation: ${response.value}`,
        );

      return response.value;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to get orientation",
        );

      throw error;
    }
  }

  async getPlatformVersion(): Promise<string> {
    const capabilities =
      appiumSession.getCapabilities();

    const version =
      String(
        capabilities.platformVersion ?? "",
      );

    useExecutionLogStore
      .getState()
      .addLog(
        "success",
        `Platform Version: ${version}`,
      );

    return version;
  }

  async getDeviceName(): Promise<string> {
    const capabilities =
      appiumSession.getCapabilities();

    const deviceName =
      String(
        capabilities.deviceName ?? "",
      );

    useExecutionLogStore
      .getState()
      .addLog(
        "success",
        `Device Name: ${deviceName}`,
      );

    return deviceName;
  }

  async getDeviceTime(): Promise<string> {
    try {
      const sessionId =
        appiumSession.getSessionId();

      const response =
        await webDriverClient.get<{
          value: string;
        }>(
          `/session/${sessionId}/appium/device/system_time`,
        );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Device Time: ${response.value}`,
        );

      return response.value;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to get device time",
        );

      throw error;
    }
  }

  async isDisplayed(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<boolean> {
    try {
      const elementId =
        await elementService.findElement(
          locatorStrategy,
          locator,
        );

      const displayed =
        await elementService.isDisplayed(
          elementId,
        );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Displayed: ${displayed}`,
        );

      return displayed;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to check displayed",
        );

      throw error;
    }
  }

  async isEnabled(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<boolean> {
    try {
      const elementId =
        await elementService.findElement(
          locatorStrategy,
          locator,
        );

      const enabled =
        await elementService.isEnabled(
          elementId,
        );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Enabled: ${enabled}`,
        );

      return enabled;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to check enabled",
        );

      throw error;
    }
  }

  async isSelected(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<boolean> {
    try {
      const elementId =
        await elementService.findElement(
          locatorStrategy,
          locator,
        );

      const selected =
        await elementService.isSelected(
          elementId,
        );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Selected: ${selected}`,
        );

      return selected;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to check selected",
        );

      throw error;
    }
  }

  async getLocation(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<{
    x: number;
    y: number;
  }> {
    try {
      const elementId =
        await elementService.findElement(
          locatorStrategy,
          locator,
        );

      const rect =
        await elementService.getRect(
          elementId,
        );

      const location = {
        x: rect.x,
        y: rect.y,
      };

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Location: (${location.x}, ${location.y})`,
        );

      return location;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to get location",
        );

      throw error;
    }
  }

  async getSize(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<{
    width: number;
    height: number;
  }> {
    try {
      const elementId =
        await elementService.findElement(
          locatorStrategy,
          locator,
        );

      const rect =
        await elementService.getRect(
          elementId,
        );

      const size = {
        width: rect.width,
        height: rect.height,
      };

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Size: ${size.width}x${size.height}`,
        );

      return size;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to get size",
        );

      throw error;
    }
  }

  async getRect(
    locatorStrategy: LocatorStrategy,
    locator: string,
  ): Promise<Rect> {
    try {
      const elementId =
        await elementService.findElement(
          locatorStrategy,
          locator,
        );

      const rect =
        await elementService.getRect(
          elementId,
        );

      useExecutionLogStore
        .getState()
        .addLog(
          "success",
          `Rect: (${rect.x}, ${rect.y}) ${rect.width}x${rect.height}`,
        );

      return rect;
    } catch (error) {
      useExecutionLogStore
        .getState()
        .addLog(
          "error",
          error instanceof Error
            ? error.message
            : "Failed to get rect",
        );

      throw error;
    }
  }
}

export const appiumClient =
  new AppiumClient();