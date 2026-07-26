import { Keyboard } from "lucide-react";

export const inputNode = {
  type: "input",

  title: "Input",

  subtitle: "Input text",

  color: "#3B82F6",

  icon: Keyboard,

  defaults: {
    action: "input",

    locatorStrategy: "id",

    locator: "",

    text: "",
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

    {
      key: "text",

      label: "Text",

      type: "text",
    },
  ],
};