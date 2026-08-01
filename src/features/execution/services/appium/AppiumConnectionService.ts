import { webDriverClient } from "./WebDriverClient";
import { useExecutionStore } from "../../store/useExecutionStore";

class AppiumConnectionService {
    private timer: number | null = null;

    start() {
        if (this.timer) {
            return;
        }

        this.check();

        this.timer = window.setInterval(
            () => this.check(),
            3000,
        );
    }

    stop() {
        if (!this.timer) {
            return;
        }

        clearInterval(this.timer);

        this.timer = null;
    }

    private async check() {
        try {
            await webDriverClient.get("/status");

            useExecutionStore
                .getState()
                .setAppiumConnection(
                    "connected",
                );
        } catch {
            useExecutionStore
                .getState()
                .setAppiumConnection(
                    "offline",
                );
        }
    }
}

export const appiumConnectionService =
    new AppiumConnectionService();