import { BadgeCheck } from "lucide-react";

export const assertNode = {
  type: "assert",

  title: "Assert",

  subtitle: "Verify value",

  color: "#F59E0B",

  icon: BadgeCheck,

  defaults: {
    action: "assert",

    locatorStrategy: "id",

    locator: "",

    expected: "",
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
      key: "expected",

      label: "Expected",

      type: "text",
    },
  ],
};