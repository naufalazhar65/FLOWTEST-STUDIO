import { Shrink } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { PinchNodeData } from "../../types/flowNode";
import { LOCATOR_STRATEGIES } from "../shared/locatorStrategies";

export const pinchPlugin: NodePlugin = {
    type: "pinch",

    title: "Pinch",

    subtitle: "Pinch gesture on element",

    color: "#F59E0B",

    icon: Shrink,

    supportedPlatforms: [
        "android",
        "ios",
    ],

    category: "interaction",

    defaults: {
        action: "pinch",

        locatorStrategy: "id",

        locator: "",

        percent: 0.75,

        duration: 300,
    },

    fields: [
        {
            key: "locatorStrategy",
            label: "Locator Strategy",
            type: "select",
            options: LOCATOR_STRATEGIES,
        },
        {
            key: "locator",
            label: "Locator",
            type: "text",
            placeholder: "Element locator",
        },
        {
            key: "percent",
            label: "Percent",
            type: "number",
            min: 0,
            max: 1,
            step: 0.1,
        },
        {
            key: "duration",
            label: "Duration (ms)",
            type: "number",
            min: 100,
            step: 100,
        },
    ],

    preview(data) {
        const pinch = data as PinchNodeData;

        return (
            <>
                <div>
                    Locator:
                    {" "}
                    <strong>
                        {pinch.locator || "-"}
                    </strong>
                </div>

                <div>
                    Percent:
                    {" "}
                    <strong>
                        {pinch.percent}
                    </strong>
                </div>

                <div>
                    Duration:
                    {" "}
                    <strong>
                        {pinch.duration} ms
                    </strong>
                </div>
            </>
        );
    },
};

export default pinchPlugin;