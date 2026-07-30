import type { LocatorStrategy } from "../../types/LocatorStrategy";
import { appiumSession } from "./AppiumSession";
import { webDriverClient } from "./WebDriverClient";

const ELEMENT_KEY =
    "element-6066-11e4-a52e-4f735466cecf";

const STRATEGY_MAP: Record<LocatorStrategy, string> = {
    id: "id",
    xpath: "xpath",
    accessibilityId: "accessibility id",
};

interface WebDriverValueResponse<T> {
    value: T;
}

interface FindElementResponse {
    value: {
        "element-6066-11e4-a52e-4f735466cecf": string;
    };
}

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class ElementService {
    private toWebDriverStrategy(
        strategy: LocatorStrategy,
    ): string {
        return STRATEGY_MAP[strategy];
    }

    async findElement(
        strategy: LocatorStrategy,
        locator: string,
    ): Promise<string> {
        const sessionId =
            appiumSession.getSessionId();

        const response =
            await webDriverClient.post<FindElementResponse>(
                `/session/${sessionId}/element`,
                {
                    using: this.toWebDriverStrategy(
                        strategy,
                    ),
                    value: locator,
                },
            );

        return response.value[ELEMENT_KEY];
    }

    async click(
        elementId: string,
    ): Promise<void> {
        const sessionId =
            appiumSession.getSessionId();

        await webDriverClient.post<void>(
            `/session/${sessionId}/element/${elementId}/click`,
            {},
        );
    }

    async sendKeys(
        elementId: string,
        text: string,
    ): Promise<void> {
        const sessionId =
            appiumSession.getSessionId();

        await webDriverClient.post<void>(
            `/session/${sessionId}/element/${elementId}/value`,
            {
                text,
            },
        );
    }

    async clear(
        elementId: string,
    ): Promise<void> {
        const sessionId =
            appiumSession.getSessionId();

        await webDriverClient.post<void>(
            `/session/${sessionId}/element/${elementId}/clear`,
            {},
        );
    }

    async getText(
        elementId: string,
    ): Promise<string> {
        const sessionId =
            appiumSession.getSessionId();

        const response =
            await webDriverClient.get<
                WebDriverValueResponse<string>
            >(
                `/session/${sessionId}/element/${elementId}/text`,
            );

        return response.value;
    }

    async getAttribute(
        elementId: string,
        attribute: string,
    ): Promise<string> {
        const sessionId =
            appiumSession.getSessionId();

        const response =
            await webDriverClient.get<
                WebDriverValueResponse<string>
            >(
                `/session/${sessionId}/element/${elementId}/attribute/${attribute}`,
            );

        return response.value;
    }

    async isDisplayed(
        elementId: string,
    ): Promise<boolean> {
        const sessionId =
            appiumSession.getSessionId();

        const response =
            await webDriverClient.get<
                WebDriverValueResponse<boolean>
            >(
                `/session/${sessionId}/element/${elementId}/displayed`,
            );

        return response.value;
    }

    async isEnabled(
        elementId: string,
    ): Promise<boolean> {
        const sessionId =
            appiumSession.getSessionId();

        const response =
            await webDriverClient.get<
                WebDriverValueResponse<boolean>
            >(
                `/session/${sessionId}/element/${elementId}/enabled`,
            );

        return response.value;
    }

    async isSelected(
        elementId: string,
    ): Promise<boolean> {
        const sessionId =
            appiumSession.getSessionId();

        const response =
            await webDriverClient.get<
                WebDriverValueResponse<boolean>
            >(
                `/session/${sessionId}/element/${elementId}/selected`,
            );

        return response.value;
    }

    async getRect(
        elementId: string,
    ): Promise<Rect> {
        const sessionId =
            appiumSession.getSessionId();

        const response =
            await webDriverClient.get<
                WebDriverValueResponse<Rect>
            >(
                `/session/${sessionId}/element/${elementId}/rect`,
            );

        return response.value;
    }
}

export const elementService =
    new ElementService();