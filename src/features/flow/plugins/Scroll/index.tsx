import { ArrowDownUp } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import type { WaitNodeData } from "../../types/flowNode";

export const scrollPlugin: NodePlugin = {
    type: "scroll",

    title: "Scroll",

    subtitle: "Scroll vertically",

    color: "#F59E0B",

    icon: ArrowDownUp,

    defaults: {
        action: "scroll",
        direction: "down",
        amount: 70,
    },

    fields: [
        {
            key: "direction",
            label: "Direction",
            type: "select",
            options: ["up", "down"],
        },
        {
            key: "amount",
            label: "Amount (%)",
            type: "number",
            min: 1,
            max: 100,
            step: 1,
            placeholder: "70",
        },
    ],

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
                    {wait.timeout} ms
                </div>
            </>
        );
    },
};