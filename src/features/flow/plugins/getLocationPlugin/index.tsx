import { MapPin } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import { createElementGetterPreview } from "../shared/createElementGetterPreview";
import { LOCATOR_STRATEGIES } from "../shared/locatorStrategies";

export const getLocationPlugin: NodePlugin = {
    type: "getLocation",

    title: "Get Location",

    subtitle: "Read element location",

    color: "#0EA5E9",

    icon: MapPin,

    // Sidebar metadata
    supportedPlatforms: [
        "cross-platform",
    ],

    category: "element",

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
            options: LOCATOR_STRATEGIES,
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

        return createElementGetterPreview({
            title: "Get Location",
            locatorStrategy: data.locatorStrategy,
            locator: data.locator,
            variableName: data.variableName,
        });
    },
};