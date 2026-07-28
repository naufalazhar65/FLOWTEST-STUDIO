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

  private delay(ms: number) {
    return new Promise((resolve) =>
      setTimeout(resolve, ms)
    );
  }
}


export const appiumClient =
  new AppiumClient();