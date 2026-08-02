import { appiumSession } from "./AppiumSession";
import { webDriverClient } from "./WebDriverClient";

export class GestureService {

    async longPress(
        elementId: string,
        duration: number,
    ): Promise<void> {

        const sessionId =
            appiumSession.getSessionId();

        await webDriverClient.post(
            `/session/${sessionId}/execute/sync`,
            {
                script: "mobile: longClickGesture",

                args: [
                    {
                        elementId,
                        duration,
                    },
                ],
            },
        );
    }

    async doubleTap(
        elementId: string,
    ): Promise<void> {

        const sessionId =
            appiumSession.getSessionId();

        await webDriverClient.post(
            `/session/${sessionId}/execute/sync`,
            {
                script: "mobile: doubleClickGesture",

                args: [
                    {
                        elementId,
                    },
                ],
            },
        );
    }

    async drag(
        elementId: string,
        direction:
            | "up"
            | "down"
            | "left"
            | "right",
        distance: number,
        duration: number,
    ): Promise<void> {

        const sessionId =
            appiumSession.getSessionId();

        await webDriverClient.post(
            `/session/${sessionId}/execute/sync`,
            {
                script: "mobile: dragGesture",

                args: [
                    {
                        elementId,

                        direction,

                        percent:
                            distance / 1000,

                        speed:
                            Math.max(
                                250,
                                Math.round(
                                    distance /
                                    (duration /
                                        1000),
                                ),
                            ),
                    },
                ],
            },
        );
    }

    async pinch(
        elementId: string,
        percent: number,
        duration: number,
    ): Promise<void> {
        const sessionId =
            appiumSession.getSessionId();

        await webDriverClient.post(
            `/session/${sessionId}/execute/sync`,
            {
                script: "mobile: pinchGesture",
                args: [
                    {
                        elementId,
                        percent,
                        duration,
                    },
                ],
            },
        );
    }

    async zoom(
        elementId: string,
        percent: number,
        duration: number,
    ): Promise<void> {
        const sessionId =
            appiumSession.getSessionId();

        await webDriverClient.post(
            `/session/${sessionId}/execute/sync`,
            {
                script: "mobile: zoomGesture",
                args: [
                    {
                        elementId,
                        percent,
                        duration,
                    },
                ],
            },
        );
    }

    async fling(
        elementId: string,
        direction:
            | "up"
            | "down"
            | "left"
            | "right",
        speed: number,
    ): Promise<void> {
        const sessionId =
            appiumSession.getSessionId();

        await webDriverClient.post(
            `/session/${sessionId}/execute/sync`,
            {
                script: "mobile: flingGesture",
                args: [
                    {
                        elementId,
                        direction,
                        speed,
                    },
                ],
            },
        );
    }
}

export const gestureService =
    new GestureService();