export const aiResponseSchema = {
  type: "object",

  additionalProperties: false,

  properties: {
    message: {
      type: "string",
    },

    intent: {
      type: "string",

      enum: ["analyzeFlow", "analyzeSelectedNode", "generateFlow"],
    },

    flowPlan: {
      anyOf: [
        {
          type: "object",

          additionalProperties: false,

          properties: {
            type: {
              type: "string",
              enum: ["flow_plan"],
            },

            summary: {
              type: "string",
            },

            steps: {
              type: "array",

              items: {
                type: "object",

                additionalProperties: false,

                properties: {
                  id: {
                    type: "string",
                  },

                  action: {
                    type: "string",

                    enum: [
                      "tap",
                      "input",
                      "swipe",
                      "scroll",
                      "delay",
                      "wait",
                      "assert",
                      "setVariable",
                      "launchApp",
                      "closeApp",
                      "back",
                      "home",
                      "screenshot",
                      "if",
                      "getText",
                      "elementExists",
                      "getAttribute",
                      "getCurrentActivity",
                      "getCurrentPackage",
                      "getOrientation",
                      "getPlatformVersion",
                      "getDeviceName",
                      "getDeviceTime",
                      "getDisplayed",
                      "getEnabled",
                      "getSelected",
                      "getLocation",
                      "getSize",
                      "getRect",
                      "longPress",
                      "doubleTap",
                      "drag",
                      "pinch",
                      "zoom",
                      "fling",
                      "hideKeyboard",
                      "pressReturn",
                    ],
                  },

                  title: {
                    type: "string",
                  },

                  description: {
                    type: "string",
                  },

                  locatorStrategy: {
                    type: ["string", "null"],
                  },

                  locator: {
                    type: ["string", "null"],
                  },

                  value: {
                    type: ["string", "null"],
                  },

                  variableName: {
                    type: ["string", "null"],
                  },

                  duration: {
                    type: ["number", "null"],
                  },

                  actual: {
                    type: ["string", "null"],
                  },

                  operator: {
                    type: ["string", "null"],
                  },

                  expected: {
                    type: ["string", "null"],
                  },

                  appPackage: {
                    type: ["string", "null"],
                  },

                  appActivity: {
                    type: ["string", "null"],
                  },

                  noReset: {
                    type: ["boolean", "null"],
                  },
                },

                required: [
                  "id",
                  "action",
                  "title",
                  "description",
                  "locatorStrategy",
                  "locator",
                  "value",
                  "variableName",
                  "duration",
                  "actual",
                  "operator",
                  "expected",
                  "appPackage",
                  "appActivity",
                  "noReset",
                ],
              },
            },

            warnings: {
              type: "array",

              items: {
                type: "string",
              },
            },
          },

          required: ["type", "summary", "steps", "warnings"],
        },

        {
          type: "null",
        },
      ],
    },
  },

  required: ["message", "intent", "flowPlan"],
};
