import { Expand } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { ZoomNodeData } from "../../types/flowNode";
import { LOCATOR_STRATEGIES } from "../shared/locatorStrategies";

export const zoomPlugin: NodePlugin = {
    type: "zoom",

    title: "Zoom",

    subtitle: "Zoom gesture on element",

    color: "#3B82F6",

    icon: Expand,

    supportedPlatforms: [
        "android",
        "ios",
    ],

    category: "interaction",

    defaults: {
        action: "zoom",

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
        const zoom = data as ZoomNodeData;

        return (
            <>
                <div>
                    Locator:{" "}
                    <strong>
                        {zoom.locator || "-"}
                    </strong>
                </div>

                <div>
                    Percent:{" "}
                    <strong>
                        {zoom.percent}
                    </strong>
                </div>

                <div>
                    Duration:{" "}
                    <strong>
                        {zoom.duration} ms
                    </strong>
                </div>
            </>
        );
    },
};

export default zoomPlugin;