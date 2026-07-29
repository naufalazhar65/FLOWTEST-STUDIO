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



  private delay(ms: number) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }
}




export const appiumClient =
  new AppiumClient();