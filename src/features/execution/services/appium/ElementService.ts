import type { LocatorStrategy } from "../../types/LocatorStrategy";
import { appiumSession } from "./AppiumSession";
import { webDriverClient } from "./WebDriverClient";

function isIOSClassName(
    strategy: LocatorStrategy,
    locator: string,
): boolean {
    return (
        strategy ===
        "className" &&
        locator.startsWith(
            "XCUIElementType",
        )
    );
}

function pageSourceContainsClassName(
    pageSource: string,
    locator: string,
): boolean {
    const escapedLocator =
        locator.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
        );

    const pattern =
        new RegExp(
            `<${escapedLocator}(?:\\s|>)`,
        );

    return pattern.test(
        pageSource,
    );
}

const ELEMENT_KEY =
    "element-6066-11e4-a52e-4f735466cecf";

const STRATEGY_MAP: Record<
    LocatorStrategy,
    string
> = {
    id: "id",

    xpath: "xpath",

    accessibilityId:
        "accessibility id",

    className:
        "class name",

    androidUiAutomator:
        "-android uiautomator",

    iOSPredicateString:
        "-ios predicate string",

    iOSClassChain:
        "-ios class chain",
};

interface WebDriverValueResponse<T> {
    value: T;
}

interface FindElementResponse {
    value: {
        "element-6066-11e4-a52e-4f735466cecf":
        string;
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

    async getPageSource(): Promise<string> {
        const sessionId =
            appiumSession.getSessionId();

        const response =
            await webDriverClient.get<
                WebDriverValueResponse<string>
            >(
                `/session/${sessionId}/source`,
            );

        return response.value;
    }

    async findElement(
        strategy: LocatorStrategy,
        locator: string,
    ): Promise<string> {
        const sessionId =
            appiumSession.getSessionId();

        /*
         * XCUITest may accept arbitrary class-name
         * strings through WebDriver/Appium even when
         * that class does not exist in the current UI
         * hierarchy.
         *
         * Validate iOS XCUI class names against the
         * actual page source first so invalid class
         * locators correctly fail execution and can
         * enter the self-healing pipeline.
         */
        if (
            isIOSClassName(
                strategy,
                locator,
            )
        ) {
            const pageSource =
                await this.getPageSource();

            if (
                !pageSourceContainsClassName(
                    pageSource,
                    locator,
                )
            ) {
                throw new Error(
                    `Class name "${locator}" was not found in the active page source.`,
                );
            }
        }

        const response =
            await webDriverClient.post<
                FindElementResponse
            >(
                `/session/${sessionId}/element`,
                {
                    using:
                        this.toWebDriverStrategy(
                            strategy,
                        ),

                    value:
                        locator,
                },
            );

        const elementId =
            response?.value?.[
            ELEMENT_KEY
            ];

        if (!elementId) {
            throw new Error(
                `Appium did not return a valid element id for ${strategy}=${locator}.`,
            );
        }

        return elementId;
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

    async longPress(
        elementId: string,
        duration: number,
    ): Promise<void> {
        const sessionId =
            appiumSession.getSessionId();

        await webDriverClient.post<void>(
            `/session/${sessionId}/execute/sync`,
            {
                script:
                    "mobile: longClickGesture",

                args: [
                    {
                        elementId,

                        duration,
                    },
                ],
            },
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