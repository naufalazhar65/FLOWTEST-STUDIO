import { useExecutionLogStore } from "../store/useExecutionLogStore";

export class AppiumClient {
  async tap(
    locatorStrategy: string,
    locator: string
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Tap ${locatorStrategy}=${locator}`
      );

    await this.delay(500);
  }

  async input(
    locatorStrategy: string,
    locator: string,
    text: string
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Input ${locatorStrategy}=${locator} → ${text}`
      );

    await this.delay(500);
  }

  async assert(
    locatorStrategy: string,
    locator: string,
    expected: string
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "success",
        `Assert ${locatorStrategy}=${locator} == ${expected}`
      );

    await this.delay(500);
  }

  async swipe(
    direction: "up" | "down" | "left" | "right",
    distance: number,
    duration: number
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Swipe ${direction} (${distance}%) ${duration} ms`
      );

    await this.delay(duration);
  }

  async scroll(
    direction: "up" | "down",
    amount: number
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Scroll ${direction} (${amount}%)`
      );

    await this.delay(500);
  }

  async waitUntilElement(
    locatorStrategy: string,
    locator: string,
    timeout: number,
    pollingInterval: number
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Wait ${locatorStrategy}=${locator} (${timeout} ms, polling ${pollingInterval} ms)`
      );

    await this.delay(timeout);
  }

  async launchApp(
    appPackage: string,
    appActivity: string,
    noReset: boolean
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Launch App ${appPackage}/${appActivity} (noReset=${noReset})`
      );

    await this.delay(1000);
  }

  async closeApp(
    appPackage: string
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Close App ${appPackage}`
      );

    await this.delay(1000);
  }

  async back() {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        "Press Back"
      );

    await this.delay(500);
  }

  async home() {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        "Press Home"
      );

    await this.delay(500);
  }

  async screenshot(
    fileName: string
  ) {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Take Screenshot: ${fileName}`
      );

    await this.delay(700);
  }


  async getText(
    locatorStrategy: string,
    locator: string
  ): Promise<string> {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Get Text ${locatorStrategy}=${locator}`
      );

    await this.delay(300);

    return "Welcome to FlowTest";
  }

  async elementExists(
    locatorStrategy: string,
    locator: string
  ): Promise<boolean> {
    console.log(
      "Element Exists",
      locatorStrategy,
      locator
    );

    return true;
  }

  async getAttribute(
    locatorStrategy: string,
    locator: string,
    attribute: string,
  ): Promise<string> {
    console.log(
      "Get Attribute",
      locatorStrategy,
      locator,
      attribute,
    );

    return "Login";
  }

  async getCurrentActivity(): Promise<string> {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        "Get Current Activity",
      );

    await this.delay(300);

    return "com.demo.MainActivity";
  }

  async getCurrentPackage(): Promise<string> {
    useExecutionLogStore.getState().addLog(
      "info",
      "Get Current Package",
    );

    await this.delay(300);

    return "com.demo.app";
  }

  async getOrientation(): Promise<string> {
    useExecutionLogStore.getState().addLog(
      "info",
      "Get Orientation",
    );

    await this.delay(300);

    return "PORTRAIT";
  }

  async getPlatformVersion(): Promise<string> {
    useExecutionLogStore.getState().addLog(
      "info",
      "Get Platform Version",
    );

    await this.delay(300);

    return "Android 15";
  }

  async getDeviceName(): Promise<string> {
    useExecutionLogStore.getState().addLog(
      "info",
      "Get Device Name",
    );

    await this.delay(300);

    return "Pixel 9 Pro";
  }

  async getDeviceTime(): Promise<string> {
    useExecutionLogStore.getState().addLog(
      "info",
      "Get Device Time",
    );

    await this.delay(300);

    return "2026-07-29T22:30:00+07:00";
  }

  async isDisplayed(
    locatorStrategy: string,
    locator: string,
  ): Promise<boolean> {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Get Displayed ${locatorStrategy}=${locator}`,
      );

    await this.delay(300);

    return true;
  }

  async isEnabled(
    locatorStrategy: string,
    locator: string,
  ): Promise<boolean> {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Get Enabled ${locatorStrategy}=${locator}`,
      );

    await this.delay(300);

    return true;
  }

  async isSelected(
    locatorStrategy: string,
    locator: string,
  ): Promise<boolean> {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Get Selected ${locatorStrategy}=${locator}`,
      );

    await this.delay(300);

    return false;
  }

  async getLocation(
    locatorStrategy: string,
    locator: string,
  ): Promise<{
    x: number;
    y: number;
  }> {
    useExecutionLogStore
      .getState()
      .addLog(
        "info",
        `Get Location ${locatorStrategy}=${locator}`,
      );

    await this.delay(300);

    return {
      x: 120,
      y: 300,
    };
  }



  private delay(ms: number) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }
}




export const appiumClient =
  new AppiumClient();