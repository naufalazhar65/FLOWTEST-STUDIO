import { Eye } from "lucide-react";

import type { NodePlugin } from "../../types/NodePlugin";
import { createElementGetterPreview } from "../shared/createElementGetterPreview";

export const getDisplayedPlugin: NodePlugin = {
    type: "getDisplayed",

    title: "Get Displayed",

    subtitle: "Check if element is displayed",

    color: "#3B82F6",

    icon: Eye,

    // Sidebar metadata
    supportedPlatforms: [
        "cross-platform",
    ],

    category: "element",

    defaults: {
        action: "getDisplayed",
        locatorStrategy: "id",
        locator: "",
        variableName: "",
    },

    fields: [
        {
            key: "locatorStrategy",
            label: "Locator Strategy",
            type: "select",
            options: ["id", "xpath", "accessibilityId"],
        },
        {
            key: "locator",
            label: "Locator",
            type: "text",
        },
        {
            key: "variableName",
            label: "Variable Name",
            type: "text",
        },
    ],

    handles: {
        outputs: ["next"],
    },

    preview(data) {
        if (data.action !== "getDisplayed") {
            return null;
        }

        return createElementGetterPreview({
            title: "Get Displayed",
            locatorStrategy: data.locatorStrategy,
            locator: data.locator,
            variableName: data.variableName,
        });
    },
};