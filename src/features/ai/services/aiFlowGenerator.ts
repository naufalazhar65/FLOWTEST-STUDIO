import type {
    AIFlowPlan,
    AIFlowStep,
} from "../types/AIFlowPlan";

function extractValue(
    message: string,
    labels: string[],
): string | undefined {
    const escapedLabels =
        labels
            .map((label) =>
                label.replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&",
                ),
            )
            .join("|");

    const patterns = [
        new RegExp(
            `(?:${escapedLabels})\\s*(?:is|=|:)\\s*["'\`]?([^"',\\n\`]+)["'\`]?`,
            "i",
        ),

        new RegExp(
            `(?:${escapedLabels})\\s+["'\`]?([^"',\\n\`]+)["'\`]?`,
            "i",
        ),
    ];

    for (
        const pattern of patterns
    ) {
        const match =
            message.match(
                pattern,
            );

        if (match?.[1]) {
            return match[1].trim();
        }
    }

    return undefined;
}

function createLoginPlan(
    message: string,
): AIFlowPlan {
    const username =
        extractValue(
            message,
            [
                "username",
                "user",
                "email",
            ],
        ) ?? "username";

    const password =
        extractValue(
            message,
            [
                "password",
                "pass",
            ],
        ) ?? "password";

    const steps: AIFlowStep[] =
        [
            {
                id:
                    crypto.randomUUID(),

                action:
                    "input",

                title:
                    "Input Username",

                description:
                    `Enter username "${username}".`,

                locatorStrategy:
                    "accessibilityId",

                locator:
                    "username",

                text:
                    username,
            },

            {
                id:
                    crypto.randomUUID(),

                action:
                    "input",

                title:
                    "Input Password",

                description:
                    "Enter the requested password.",

                locatorStrategy:
                    "accessibilityId",

                locator:
                    "password",

                text:
                    password,
            },

            {
                id:
                    crypto.randomUUID(),

                action:
                    "tap",

                title:
                    "Tap Login",

                description:
                    "Tap the Login button.",

                locatorStrategy:
                    "accessibilityId",

                locator:
                    "Login",
            },

            {
                id:
                    crypto.randomUUID(),

                action:
                    "assert",

                title:
                    "Verify Dashboard",

                description:
                    "Verify that the Dashboard text is present.",

                actual:
                    "Dashboard",

                operator:
                    "contains",

                expected:
                    "Dashboard",
            },
        ];

    return {
        type:
            "flow_plan",

        summary:
            "Create a login flow with username, password, login action, and Dashboard verification.",

        steps,

        warnings: [
            "Locators are inferred from the prompt and should be verified before applying the plan.",
        ],
    };
}

function createTapPlan(
    message: string,
): AIFlowPlan | null {
    const match =
        message.match(
            /(?:tap|click|press)\s+(?:the\s+)?["'`](.+?)["'`]/i,
        );

    if (!match?.[1]) {
        return null;
    }

    const target =
        match[1].trim();

    return {
        type:
            "flow_plan",

        summary:
            `Tap the "${target}" element.`,

        steps: [
            {
                id:
                    crypto.randomUUID(),

                action:
                    "tap",

                title:
                    `Tap ${target}`,

                description:
                    `Tap the "${target}" element.`,

                locatorStrategy:
                    "accessibilityId",

                locator:
                    target,
            },
        ],

        warnings: [
            "The locator strategy was inferred from the prompt.",
        ],
    };
}

function createInputPlan(
    message: string,
): AIFlowPlan | null {
    const text =
        extractValue(
            message,
            [
                "input",
                "enter",
                "type",
            ],
        );

    if (!text) {
        return null;
    }

    const locator =
        extractValue(
            message,
            [
                "field",
                "textbox",
                "input",
            ],
        ) ?? "input";

    return {
        type:
            "flow_plan",

        summary:
            `Enter "${text}" into the ${locator} field.`,

        steps: [
            {
                id:
                    crypto.randomUUID(),

                action:
                    "input",

                title:
                    `Input ${text}`,

                description:
                    `Enter "${text}" into the ${locator} field.`,

                locatorStrategy:
                    "accessibilityId",

                locator,

                text,
            },
        ],

        warnings: [
            "The target locator was inferred from the prompt.",
        ],
    };
}

export function generateAIFlowPlan(
    message: string,
): AIFlowPlan | null {
    const normalized =
        message
            .trim()
            .toLowerCase();

    if (!normalized) {
        return null;
    }

    if (
        normalized.includes(
            "login",
        ) ||
        normalized.includes(
            "log in",
        ) ||
        normalized.includes(
            "sign in",
        ) ||
        normalized.includes(
            "masuk",
        )
    ) {
        return createLoginPlan(
            message,
        );
    }

    const tapPlan =
        createTapPlan(
            message,
        );

    if (tapPlan) {
        return tapPlan;
    }

    return createInputPlan(
        message,
    );
}