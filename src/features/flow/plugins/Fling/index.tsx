import { Move } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { FlingNodeData } from "../../types/flowNode";

export const flingPlugin: NodePlugin = {
    type: "fling",

    title: "Fling",

    subtitle: "Fling gesture on element",

    color: "#8B5CF6",

    icon: Move,

    supportedPlatforms: [
        "android",
        "ios",
    ],

    category: "interaction",

    defaults: {
        action: "fling",

        locatorStrategy: "id",

        locator: "",

        direction: "down",

        speed: 2000,
    },

    fields: [
        {
            key: "locatorStrategy",
            label: "Locator Strategy",
            type: "select",
            options: [
                "id",
                "xpath",
                "accessibilityId",
                "className",
                "androidUiAutomator",
                "iOSPredicateString",
                "iOSClassChain",
            ],
        },
        {
            key: "locator",
            label: "Locator",
            type: "text",
            placeholder: "Element locator",
        },
        {
            key: "direction",
            label: "Direction",
            type: "select",
            options: [
                "up",
                "down",
                "left",
                "right",
            ],
        },
        {
            key: "speed",
            label: "Speed",
            type: "number",
            min: 100,
            step: 100,
        },
    ],

    preview(data) {
        const fling = data as FlingNodeData;

        return (
            <>
                <div>
                    Locator:{" "}
                    <strong>
                        {fling.locator || "-"}
                    </strong>
                </div>

                <div>
                    Direction:{" "}
                    <strong>
                        {fling.direction}
                    </strong>
                </div>

                <div>
                    Speed:{" "}
                    <strong>
                        {fling.speed}
                    </strong>
                </div>
            </>
        );
    },
};

export default flingPlugin;