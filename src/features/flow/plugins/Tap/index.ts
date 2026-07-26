import { MousePointerClick } from "lucide-react";

export const tapNode = {
  type: "tap",

  title: "Tap",

  subtitle: "Tap an element",

  color: "#22C55E",

  icon: MousePointerClick,

  defaults: {
    action: "tap",

    locatorStrategy: "id",

    locator: "",
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
      ],
    },

    {
      key: "locator",

      label: "Locator",

      type: "text",
    },
  ],
};