import { Hourglass } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { WaitNodeData } from "../../types/flowNode";

export const waitPlugin: NodePlugin = {
    type: "wait",

    title: "Wait Until Element",

    subtitle: "Wait until an element is visible",

    color: "#EAB308",

    icon: Hourglass,


    // Sidebar metadata
    supportedPlatforms: [
        "cross-platform",
    ],

    category: "interaction",
    defaults: {
        action: "wait",

        locatorStrategy: "id",

        locator: "",

        timeout: 10000,

        pollingInterval: 500,
    },

    fields: [
        {
            key: "locatorStrategy",
            label: "Locator Strategy",
            type: "select",

            options: [
                "id",
                "accessibilityId",
                "xpath",
            ],
        },

        {
            key: "locator",
            label: "Locator",
            type: "text",

            placeholder: "login_button",
        },

        {
            key: "timeout",
            label: "Timeout (ms)",
            type: "number",

            min: 100,
            step: 100,
        },

        {
            key: "pollingInterval",
            label: "Polling Interval (ms)",
            type: "number",

            min: 100,
            step: 100,
        },
    ],

    handles: {
        outputs: ["next"],
    },

    preview: (data) => {
        const wait = data as WaitNodeData;

        return (
            <>
                <div>⏳ Wait Until Element</div>

                <div
                    style={{
                        fontSize: 12,
                        opacity: 0.7,
                        marginTop: 4,
                    }}
                >
                    {wait.locatorStrategy} = {wait.locator || "-"}
                </div>

                <div
                    style={{
                        fontSize: 12,
                        opacity: 0.7,
                    }}
                >
                    Timeout: {wait.timeout} ms
                </div>

                <div
                    style={{
                        fontSize: 12,
                        opacity: 0.7,
                    }}
                >
                    Polling: {wait.pollingInterval} ms
                </div>
            </>
        );
    },
};