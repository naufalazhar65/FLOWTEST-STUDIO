import { MapPin } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";

export const getLocationPlugin: NodePlugin = {
    type: "getLocation",

    title: "Get Location",

    subtitle: "Read element location",

    color: "#0EA5E9",

    icon: MapPin,

    defaults: {
        action: "getLocation",

        locatorStrategy: "id",

        locator: "",

        variableName: "",
    },

    handles: {
        outputs: ["next"],
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
                "className",
                "androidUiAutomator",
                "iosPredicateString",
            ],
        },
        {
            key: "locator",
            label: "Locator",
            type: "text",
            placeholder: "com.demo:id/login_button",
        },
        {
            key: "variableName",
            label: "Variable Name",
            type: "text",
            placeholder: "location",
        },
    ],
    preview(data) {
        if (data.action !== "getLocation") {
            return null;
        }

        return (
            <>
                <div
                    style={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: 14,
                    }}
                >
                    Get Location
                </div>

                <div
                    style={{
                        color: "#94A3B8",
                        fontSize: 13,
                    }}
                >
                    {data.locatorStrategy}={data.locator || "-"}
                </div>

                <div
                    style={{
                        color: "#64748B",
                        fontSize: 12,
                    }}
                >
                    → {data.variableName || "(variable)"}
                </div>
            </>
        );
    },
};