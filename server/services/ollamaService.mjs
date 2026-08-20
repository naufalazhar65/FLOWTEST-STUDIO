import {
    resolveModificationTarget,
} from "./resolveModificationTarget.mjs";

import {
    findAmbiguousModificationTargets,
} from "./resolveModificationTarget.mjs";

import {
    analyzeFlowQuality,
} from "./qaIntelligence/analyzeFlowQuality.mjs";

import {
    buildQARecommendations,
} from "./qaIntelligence/buildQARecommendations.mjs";

import {
    buildQAReviewMessage,
} from "./qaIntelligence/buildQAReviewMessage.mjs";

const baseUrl =
    process.env.OLLAMA_BASE_URL ??
    "http://localhost:11434";

const model =
    process.env.OLLAMA_MODEL ??
    "qwen3:1.7b";

const VALID_INTENTS = new Set([
    "analyzeFlow",
    "analyzeSelectedNode",
    "analyzeExecution",
    "generateFlow",
    "modifyFlow",
    "reviewFlow",
]);

const VALID_ACTIONS = new Set([
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
    "repeat",
]);

const VALID_LOCATOR_STRATEGIES =
    new Set([
        "accessibilityId",
        "id",
        "xpath",
        "className",
        "androidUiAutomator",
        "iOSPredicateString",
        "iOSClassChain",
    ]);

const VALID_ASSERT_OPERATORS =
    new Set([
        "equals",
        "notEquals",
        "contains",
        "notContains",
        "startsWith",
        "endsWith",
        "greaterThan",
        "greaterThanOrEqual",
        "lessThan",
        "lessThanOrEqual",
        "isTrue",
        "isFalse",
        "isEmpty",
        "isNotEmpty",
        "matches",
    ]);

function extractValue(
    text,
    labels,
) {
    if (typeof text !== "string") {
        return null;
    }

    const labelPattern =
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
            `(?:${labelPattern})\\s*(?:is|=|:)\\s*["'\`]?([^"',\\n\`]+?)["'\`]?\\s*(?:,|\\.|$)`,
            "i",
        ),

        new RegExp(
            `(?:${labelPattern})\\s+["'\`]?([^"',\\n\`]+?)["'\`]?\\s*(?:,|\\.|$)`,
            "i",
        ),
    ];

    for (
        const pattern of patterns
    ) {
        const match =
            text.match(pattern);

        if (match?.[1]) {
            return match[1].trim();
        }
    }

    return null;
}

function extractLoginValues(
    message,
) {
    return {
        username:
            extractValue(
                message,
                [
                    "username",
                    "user",
                    "email",
                ],
            ),

        password:
            extractValue(
                message,
                [
                    "password",
                    "pass",
                ],
            ),
    };
}

function createStep({
    id,
    action,
    title,
    description,
    locatorStrategy = null,
    locator = null,
    text = null,
    variableName = null,
    duration = null,
    actual = null,
    operator = null,
    expected = null,
    appPackage = null,
    appActivity = null,
    noReset = null,
    timeout = null,
    pollingInterval = null,
    attribute = null,
    count = null,
    direction = null,
    distance = null,
    amount = null,
    speed = null,
    percent = null,
    fileName = null,
    platform = null,
    bundleId = null,
    app = null,
}) {
    return {
        id,
        action,
        title,
        description,
        locatorStrategy,
        locator,
        text,
        variableName,
        duration,
        actual,
        operator,
        expected,
        appPackage,
        appActivity,
        noReset,
        timeout,
        pollingInterval,
        attribute,
        count,
        direction,
        distance,
        amount,
        speed,
        percent,
        fileName,
        platform,
        bundleId,
        app,
    };
}

function normalizeAssertOperator(
    operator,
) {
    if (typeof operator !== "string") {
        return "contains";
    }

    const normalized =
        operator
            .trim()
            .toLowerCase();

    const operatorMap = {
        "==": "equals",
        "=": "equals",
        "===": "equals",

        "!=": "notEquals",
        "<>": "notEquals",

        contains: "contains",

        "not contains":
            "notContains",

        "starts with":
            "startsWith",

        "ends with":
            "endsWith",

        ">": "greaterThan",
        ">=": "greaterThanOrEqual",

        "<": "lessThan",
        "<=": "lessThanOrEqual",

        true: "isTrue",
        false: "isFalse",

        empty: "isEmpty",

        "not empty":
            "isNotEmpty",

        matches: "matches",
    };

    const mapped =
        operatorMap[normalized];

    if (
        mapped &&
        VALID_ASSERT_OPERATORS.has(
            mapped,
        )
    ) {
        return mapped;
    }

    if (
        VALID_ASSERT_OPERATORS.has(
            normalized,
        )
    ) {
        return normalized;
    }

    return "contains";
}

function normalizeIntent(
    value,
    parsed,
    message = "",
) {

   const normalizedMessage =
    typeof message ===
        "string"
        ? message.toLowerCase()
        : "";

/*
 * IMPORTANT:
 * ...
 */
    /*
     * IMPORTANT:
     * Modification detection MUST happen
     * before selected-node analysis.
     *
     * Example:
     * "Tambahkan tap Login setelah node
     * yang dipilih"
     *
     * This contains "node yang dipilih",
     * but the actual intent is modifyFlow.
     */
    const modificationPatterns = [
        /\btambahkan\b/i,
        /\btambah\b/i,
        /\bsisipkan\b/i,
        /\bmasukkan\b/i,
        /\bubah\b/i,
        /\bubah menjadi\b/i,
        /\bupdate\b/i,
        /\bmodify\b/i,
        /\bedit\b/i,
        /\binsert\b/i,
        /\bremove\b/i,
        /\bhapus\b/i,
        /\bdelete\b/i,

        /\btambahkan\s+.+\s+setelah\b/i,
        /\btambahkan\s+.+\s+sebelum\b/i,
        /\btambah\s+.+\s+setelah\b/i,
        /\btambah\s+.+\s+sebelum\b/i,

        /\bsetelah\s+node\s+yang\s+dipilih\b/i,
        /\bsetelah\s+node\s+ini\b/i,
        /\bsebelum\s+node\s+yang\s+dipilih\b/i,
        /\bsebelum\s+node\s+ini\b/i,

        /\bafter\s+the\s+selected\s+node\b/i,
        /\bafter\s+this\s+node\b/i,
        /\bbefore\s+the\s+selected\s+node\b/i,
        /\bbefore\s+this\s+node\b/i,
    ];

    if (
        modificationPatterns.some(
            (pattern) =>
                pattern.test(
                    normalizedMessage,
                ),
        )
    ) {
        return "modifyFlow";
    }

        /*
     * --------------------------------------------------
     * Execution / failure analysis.
     * --------------------------------------------------
     *
     * Questions about why a node or test execution
     * failed must be routed to execution analysis.
     *
     * This is different from selected-node analysis:
     *
     * "Apa yang dilakukan node ini?"
     *     -> analyzeSelectedNode
     *
     * "Kenapa node ini gagal?"
     *     -> analyzeExecution
     */
    const executionAnalysisPatterns = [
        /\bkenapa\s+.+\s+gagal\b/i,
        /\bmengapa\s+.+\s+gagal\b/i,
        /\bapa\s+penyebab\s+.+\s+gagal\b/i,
        /\bpenyebab\s+.+\s+gagal\b/i,
        /\bkenapa\s+test\s+.+\s+gagal\b/i,
        /\bmengapa\s+test\s+.+\s+gagal\b/i,
        /\bkenapa\s+node\s+.+\s+gagal\b/i,
        /\bmengapa\s+node\s+.+\s+gagal\b/i,
        /\bkenapa\s+node\s+ini\s+gagal\b/i,
        /\bmengapa\s+node\s+ini\s+gagal\b/i,
        /\bkenapa\s+execution\s+gagal\b/i,
        /\bmengapa\s+execution\s+gagal\b/i,
        /\bwhy\s+did\s+.+\s+fail\b/i,
        /\bwhy\s+did\s+the\s+test\s+fail\b/i,
        /\bwhy\s+did\s+this\s+node\s+fail\b/i,
        /\bwhy\s+did\s+the\s+node\s+fail\b/i,
        /\bwhat\s+caused\s+.+\s+to\s+fail\b/i,
        /\bwhat\s+caused\s+the\s+test\s+to\s+fail\b/i,
        /\bwhat\s+caused\s+the\s+node\s+to\s+fail\b/i,
    ];

    if (
        executionAnalysisPatterns.some(
            (pattern) =>
                pattern.test(
                    normalizedMessage,
                ),
        )
    ) {
        return "analyzeExecution";
    }

    /*
     * Selected-node analysis.
     *
     * Only match when the user is actually
     * asking to explain the selected node.
     */
    const selectedNodePatterns = [
        /\bjelaskan\s+node\b/i,
        /\bjelaskan\s+node\s+ini\b/i,
        /\bterangkan\s+node\b/i,
        /\bterangkan\s+node\s+ini\b/i,
        /\bnode\s+ini\s+apa\b/i,
        /\bapa\s+node\s+ini\b/i,
        /\bjelaskan\s+node\s+yang\s+dipilih\b/i,

        /\bexplain\s+this\s+node\b/i,
        /\bexplain\s+the\s+selected\s+node\b/i,
        /\bwhat\s+is\s+this\s+node\b/i,
        /\bwhat\s+does\s+this\s+node\s+do\b/i,
    ];

    if (
        selectedNodePatterns.some(
            (pattern) =>
                pattern.test(
                    normalizedMessage,
                ),
        )
    ) {
        return "analyzeSelectedNode";
    }

    

    /*
 * --------------------------------------------------
 * QA flow review.
 * --------------------------------------------------
 */

const qaReviewPatterns = [
    /\breview\s+(the\s+)?flow\b/i,
    /\breview\s+(the\s+)?test\s+flow\b/i,
    /\bcheck\s+(the\s+)?flow\s+quality\b/i,
    /\bcheck\s+(the\s+)?test\s+quality\b/i,
    /\banalyze\s+(the\s+)?flow\s+quality\b/i,

    /\breview\s+kualitas\s+flow\b/i,
    /\breview\s+flow\s+ini\b/i,
    /\bcek\s+kualitas\s+flow\b/i,
    /\bperiksa\s+kualitas\s+flow\b/i,
    /\banalisis\s+kualitas\s+flow\b/i,
    /\banalisa\s+kualitas\s+flow\b/i,
];

if (
    qaReviewPatterns.some(
        (pattern) =>
            pattern.test(
                normalizedMessage,
            ),
    )
) {
    return "reviewFlow";
}

    /*
     * Current-flow analysis.
     */
    const flowAnalysisPatterns = [
        /\bjelaskan\s+flow\b/i,
        /\bjelaskan\s+alur\b/i,
        /\bapa\s+yang\s+dilakukan\s+flow\b/i,
        /\bapa\s+yang\s+dilakukan\s+alur\b/i,
        /\banalisa\s+flow\b/i,
        /\banalisis\s+flow\b/i,
        /\banalisa\s+alur\b/i,
        /\banalisis\s+alur\b/i,

        /\bexplain\s+(the\s+)?flow\b/i,
        /\bexplain\s+(the\s+)?test\s+flow\b/i,
        /\bwhat\s+does\s+(the\s+)?flow\s+do\b/i,
        /\banalyze\s+(the\s+)?flow\b/i,
        /\banalyse\s+(the\s+)?flow\b/i,
    ];

    if (
        flowAnalysisPatterns.some(
            (pattern) =>
                pattern.test(
                    normalizedMessage,
                ),
        )
    ) {
        return "analyzeFlow";
    }

    /*
     * Model-provided intent is only used
     * as a fallback.
     */
    if (
        typeof value === "string"
    ) {
        const normalized =
            value
                .trim()
                .toLowerCase()
                .replace(
                    /[\s_-]+/g,
                    "",
                );

        if (
            normalized ===
            "analyzeflow"
        ) {
            return "analyzeFlow";
        }

        if (
            normalized ===
            "analyzeselectednode"
        ) {
            return "analyzeSelectedNode";
        }

        if (
            normalized ===
            "modifyflow"
        ) {
            return "modifyFlow";
        }

        if (
            normalized ===
            "reviewflow"
        ) {
            return "reviewFlow";
        }

        if (
            normalized ===
            "generateflow"
        ) {
            return "generateFlow";
        }
    }

    /*
     * If the model returned a flow plan
     * and no deterministic intent matched,
     * treat it as generation.
     */
    if (
        parsed?.flowPlan &&
        typeof parsed.flowPlan ===
            "object"
    ) {
        return "generateFlow";
    }

    /*
     * Default for creation requests.
     */
    return "generateFlow";
}

function normalizeNativeStep(
    step,
    index,
) {
    if (
        !step ||
        typeof step !== "object"
    ) {
        return null;
    }

    const action =
        typeof step.action ===
        "string"
            ? step.action
            : "";

    if (
        !VALID_ACTIONS.has(
            action,
        )
    ) {
        return null;
    }

    const value =
        step.value &&
        typeof step.value ===
            "object"
            ? step.value
            : null;

    const id =
        typeof step.id ===
        "string"
            ? step.id
            : `ai-step-${index + 1}`;

    /*
     * ASSERT
     *
     * Qwen may return:
     *
     * {
     *   action: "assert",
     *   value: {
     *     actual: "Dashboard",
     *     operator: "==",
     *     expected: "Dashboard"
     *   }
     * }
     */
    if (
        action === "assert"
    ) {
        const actual =
            typeof step.actual ===
            "string"
                ? step.actual
                : typeof value?.actual ===
                    "string"
                    ? value.actual
                    : "";

        const expected =
            typeof step.expected ===
            "string"
                ? step.expected
                : typeof value?.expected ===
                    "string"
                    ? value.expected
                    : "";

        const operator =
            normalizeAssertOperator(
                step.operator ??
                    value?.operator,
            );

        return createStep({
            id,

            action: "assert",

            title:
                expected
                    ? `Verify ${expected}`
                    : "Verify Result",

            description:
                expected
                    ? `Verify that ${expected} is present.`
                    : "Verify the expected result.",

            locatorStrategy:
                null,

            locator:
                null,

            value:
                null,

            variableName:
                null,

            duration:
                null,

            actual:
                actual || null,

            operator,

            expected:
                expected || null,

            appPackage:
                null,

            appActivity:
                null,

            noReset:
                null,
        });
    }

    /*
     * TAP
     *
     * Qwen may return:
     *
     * {
     *   action: "tap",
     *   value: "Login"
     * }
     */
    if (
        action === "tap"
    ) {
        const locator =
            typeof step.locator ===
            "string"
                ? step.locator
                : typeof step.value ===
                    "string"
                    ? step.value
                    : null;

        const locatorStrategy =
            VALID_LOCATOR_STRATEGIES.has(
                step.locatorStrategy,
            )
                ? step.locatorStrategy
                : "accessibilityId";

        return createStep({
            id,

            action: "tap",

            title:
                locator
                    ? `Tap ${locator}`
                    : "Tap Element",

            description:
                locator
                    ? `Tap the ${locator} element.`
                    : "Tap the target element.",

            locatorStrategy,

            locator,

            value:
                null,

            variableName:
                null,

            duration:
                null,

            actual:
                null,

            operator:
                null,

            expected:
                null,

            appPackage:
                null,

            appActivity:
                null,

            noReset:
                null,
        });
    }

    /*
     * INPUT
     *
     * Qwen may return:
     *
     * {
     *   action: "input",
     *   value: "naufal"
     * }
     */
    if (
        action === "input"
    ) {
        const inputText =
    typeof step.text ===
    "string"
        ? step.text
        : typeof step.value ===
            "string"
            ? step.value
            : null;

        const locator =
            typeof step.locator ===
            "string"
                ? step.locator
                : null;

        const locatorStrategy =
            VALID_LOCATOR_STRATEGIES.has(
                step.locatorStrategy,
            )
                ? step.locatorStrategy
                : "accessibilityId";

        return createStep({
            id,

            action: "input",

            title:
                step.title ??
                "Input Text",

            description:
                step.description ??
                "Enter the requested value.",

            locatorStrategy,

            locator,

            value:
                inputValue,

            variableName:
                null,

            duration:
                null,

            actual:
                null,

            operator:
                null,

            expected:
                null,

            appPackage:
                null,

            appActivity:
                null,

            noReset:
                null,
        });
    }

    /*
     * DELAY
     */
    if (
        action === "delay"
    ) {
        return createStep({
            id,

            action: "delay",

            title:
                step.title ??
                "Delay",

            description:
                step.description ??
                "Wait for the specified duration.",

            locatorStrategy:
                null,

            locator:
                null,

            value:
                null,

            variableName:
                null,

            duration:
                typeof step.duration ===
                "number" &&
                step.duration > 0
                    ? step.duration
                    : 1000,

            actual:
                null,

            operator:
                null,

            expected:
                null,

            appPackage:
                null,

            appActivity:
                null,

            noReset:
                null,
        });
    }

    /*
     * Generic supported action.
     */
    let locatorStrategy =
        typeof step.locatorStrategy ===
        "string"
            ? step.locatorStrategy
            : null;

    if (
        !VALID_LOCATOR_STRATEGIES.has(
            locatorStrategy,
        )
    ) {
        locatorStrategy =
            null;
    }

    return createStep({
        id,

        action,

        title:
            typeof step.title ===
            "string"
                ? step.title
                : action,

        description:
            typeof step.description ===
            "string"
                ? step.description
                : `Execute ${action}.`,

        locatorStrategy,

        locator:
            typeof step.locator ===
            "string"
                ? step.locator
                : null,

        value:
            typeof step.value ===
            "string"
                ? step.value
                : null,

        variableName:
            typeof step.variableName ===
            "string"
                ? step.variableName
                : null,

        duration:
            typeof step.duration ===
            "number"
                ? step.duration
                : null,

        actual:
            typeof step.actual ===
            "string"
                ? step.actual
                : null,

        operator:
            action === "assert"
                ? normalizeAssertOperator(
                      step.operator,
                  )
                : null,

        expected:
            typeof step.expected ===
            "string"
                ? step.expected
                : null,

        appPackage:
            typeof step.appPackage ===
            "string"
                ? step.appPackage
                : null,

        appActivity:
            typeof step.appActivity ===
            "string"
                ? step.appActivity
                : null,

        noReset:
            typeof step.noReset ===
            "boolean"
                ? step.noReset
                : null,
    });
}

function normalizeNodeToStep(
    node,
    index,
) {
    const action =
        typeof node?.type ===
        "string"
            ? node.type
            : "";

    const properties =
        node?.properties &&
        typeof node.properties ===
            "object"
            ? node.properties
            : {};

    const id =
        typeof node?.id ===
        "string"
            ? node.id
            : `ai-step-${index + 1}`;

    if (
        !VALID_ACTIONS.has(
            action,
        )
    ) {
        return null;
    }

    if (
        action === "tap"
    ) {
        const locator =
            typeof properties.locator ===
            "string"
                ? properties.locator
                : "";

        const strategy =
            typeof properties.strategy ===
            "string"
                ? properties.strategy
                : "accessibilityId";

        return createStep({
            id,

            action: "tap",

            title:
                locator
                    ? `Tap ${locator}`
                    : "Tap Element",

            description:
                locator
                    ? `Tap the ${locator} element.`
                    : "Tap the target element.",

            locatorStrategy:
                VALID_LOCATOR_STRATEGIES.has(
                    strategy,
                )
                    ? strategy
                    : "accessibilityId",

            locator:
                locator || null,
        });
    }

    if (
        action === "input"
    ) {
        const locator =
            typeof properties.locator ===
            "string"
                ? properties.locator
                : "";

        const text =
    typeof properties.text ===
    "string"
        ? properties.text
        : typeof properties.value ===
            "string"
            ? properties.value
            : "";

        const strategy =
            typeof properties.strategy ===
            "string"
                ? properties.strategy
                : "accessibilityId";

        return createStep({
            id,

            action: "input",

            title:
                locator
                    ? `Input ${locator}`
                    : "Input Text",

            description:
                locator
                    ? `Enter the value into the ${locator} field.`
                    : "Enter the requested value.",

            locatorStrategy:
                VALID_LOCATOR_STRATEGIES.has(
                    strategy,
                )
                    ? strategy
                    : "accessibilityId",

            locator:
                locator || null,

            text:
                text || null,
        });
    }

    if (
        action === "assert"
    ) {
        const actual =
            typeof properties.actual ===
            "string"
                ? properties.actual
                : typeof properties.locator ===
                    "string"
                    ? properties.locator
                    : "";

        const expected =
            typeof properties.expected ===
            "string"
                ? properties.expected
                : actual;

        let operator =
            typeof properties.operator ===
            "string"
                ? properties.operator
                : "contains";

        if (
            properties.strategy ===
            "displayed"
        ) {
            operator = "contains";
        }

        if (
            !VALID_ASSERT_OPERATORS.has(
                operator,
            )
        ) {
            operator = "contains";
        }

        return createStep({
            id,

            action: "assert",

            title:
                expected
                    ? `Verify ${expected}`
                    : "Verify Result",

            description:
                expected
                    ? `Verify that ${expected} is present.`
                    : "Verify the expected result.",

            locatorStrategy:
                null,

            locator:
                null,

            actual:
                actual || null,

            operator,

            expected:
                expected || null,
        });
    }

    if (
        action === "delay"
    ) {
        const duration =
            typeof properties.duration ===
                "number" &&
            properties.duration >
                0
                ? properties.duration
                : 1000;

        return createStep({
            id,

            action: "delay",

            title: "Delay",

            description:
                "Wait for the specified duration.",

            duration,
        });
    }

    return null;
}

function insertBeforeAction(
    steps,
    action,
    newStep,
) {
    const index =
        steps.findIndex(
            (step) =>
                step?.action ===
                action,
        );

    if (index >= 0) {
        steps.splice(
            index,
            0,
            newStep,
        );

        return;
    }

    steps.push(newStep);
}

function normalizeModelFlowPlan(
    rawPlan,
    message,
) {
    if (
        !rawPlan ||
        typeof rawPlan !==
            "object"
    ) {
        return null;
    }

    /*
 * Case 0:
 * Qwen may return flowPlan directly
 * as an array of steps.
 */
if (Array.isArray(rawPlan)) {
    const {
        username,
        password,
    } = extractLoginValues(message);

    const steps = rawPlan
        .map((step, index) =>
            normalizeNativeStep(
                step,
                index,
            ),
        )
        .filter(Boolean);

    /*
     * Qwen sometimes returns input steps
     * without a locator:
     *
     * {
     *   action: "input",
     *   value: "naufal"
     * }
     *
     * Resolve those inputs using the
     * username/password values from the
     * user's original request.
     */
    const unlocatedInputs =
        steps.filter(
            (step) =>
                step.action === "input" &&
                !step.locator,
        );

    if (
        username &&
        unlocatedInputs.length > 0
    ) {
        const usernameStep =
            unlocatedInputs.find(
                (step) =>
                    step.text === username
            );

        if (usernameStep) {
            usernameStep.locator =
                "username";

            usernameStep.locatorStrategy =
                "accessibilityId";

            usernameStep.title =
                "Input Username";

            usernameStep.description =
                `Enter username "${username}".`;
        }
    }

    if (
        password &&
        unlocatedInputs.length > 0
    ) {
        const passwordStep =
            unlocatedInputs.find(
                (step) =>
                   step.text === password
            );

        if (passwordStep) {
            passwordStep.locator =
                "password";

            passwordStep.locatorStrategy =
                "accessibilityId";

            passwordStep.title =
                "Input Password";

            passwordStep.description =
                `Enter password "${password}".`;
        }
    }

    /*
     * Only add username/password if
     * they are still genuinely missing.
     */
    if (
        username &&
        !steps.some(
            (step) =>
                step.action === "input" &&
                (
                    step.locator ===
                        "username" ||
                    step.text === username
                ),
        )
    ) {
        insertBeforeAction(
            steps,
            "tap",
            createStep({
    id: "ai-input-username",
    action: "input",
    title: "Input Username",
    description:
        `Enter username "${username}".`,
    locatorStrategy:
        "accessibilityId",
    locator: "username",
    text: username,
})
        );
    }

    if (
        password &&
        !steps.some(
            (step) =>
                step.action === "input" &&
                (
                    step.locator ===
                        "password" ||
                    step.text === password
                ),
        )
    ) {
        insertBeforeAction(
            steps,
            "tap",
            createStep({
    id: "ai-input-password",
    action: "input",
    title: "Input Password",
    description:
        `Enter password "${password}".`,
    locatorStrategy:
        "accessibilityId",
    locator: "password",
    text: password,
})
        );
    }

    return {
        type:
            "flow_plan",

        summary:
            "Generated flow plan.",

        steps,

        warnings: [
            "Some flow data was normalized from the model response.",

            "Locators inferred from natural language should be verified before applying the plan.",
        ],
    };
}

    /*
     * Model already returned
     * native AIFlowPlan format.
     */
    if (
        Array.isArray(
            rawPlan.steps,
        )
    ) {
        const steps =
            rawPlan.steps
                .map(
                    (
                        step,
                        index,
                    ) =>
                        normalizeNativeStep(
                            step,
                            index,
                        ),
                )
                .filter(
                    Boolean,
                );

        return {
            type: "flow_plan",

            summary:
                typeof rawPlan.summary ===
                "string"
                    ? rawPlan.summary
                    : "Generated flow plan.",

            steps,

            warnings:
                Array.isArray(
                    rawPlan.warnings,
                )
                    ? rawPlan.warnings.filter(
                          (
                              warning,
                          ) =>
                              typeof warning ===
                              "string",
                      )
                    : [],
        };
    }

    /*
     * Qwen may return:
     *
     * flowPlan.nodes
     * flowPlan.edges
     */
    if (
        Array.isArray(
            rawPlan.nodes,
        )
    ) {
        const steps =
            rawPlan.nodes
                .map(
                    (
                        node,
                        index,
                    ) =>
                        normalizeNodeToStep(
                            node,
                            index,
                        ),
                )
                .filter(
                    Boolean,
                );

        const {
            username,
            password,
        } =
            extractLoginValues(
                message,
            );

        /*
         * Restore username input when the
         * user explicitly supplied username.
         */
        if (
            username &&
            !steps.some(
                (step) =>
                    step.action ===
                        "input" &&
                    step.locator ===
                        "username",
            )
        ) {
            insertBeforeAction(
                steps,

                "tap",

                createStep({
                    id:
                        "ai-input-username",

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

                    value:
                        username,
                }),
            );
        }

        /*
         * Restore password input when the
         * user explicitly supplied password.
         */
        if (
            password &&
            !steps.some(
                (step) =>
                    step.action ===
                        "input" &&
                    step.locator ===
                        "password",
            )
        ) {
            insertBeforeAction(
                steps,

                "tap",

                createStep({
                    id:
                        "ai-input-password",

                    action:
                        "input",

                    title:
                        "Input Password",

                    description:
                        `Enter password "${password}".`,

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "password",

                    value:
                        password,
                }),
            );
        }

        return {
            type: "flow_plan",

            summary:
                typeof rawPlan.summary ===
                "string"
                    ? rawPlan.summary
                    : "Generated flow plan.",

            steps,

            warnings: [
                "Some flow data was normalized from the model response.",

                "Locators inferred from natural language should be verified before applying the plan.",
            ],
        };
    }

    return null;
}

function validateNormalizedPlan(
    plan,
) {
    if (
        !plan ||
        typeof plan !==
            "object"
    ) {
        return null;
    }

    if (
        plan.type !==
        "flow_plan"
    ) {
        return null;
    }

    if (
        !Array.isArray(
            plan.steps,
        )
    ) {
        return null;
    }

    const steps =
        plan.steps
            .filter(Boolean)
            .map((step) => {
                if (
                    step.action ===
                    "assert"
                ) {
                    return createStep({
                        id:
                            step.id,

                        action:
                            "assert",

                        title:
                            step.title ||
                            "Verify Result",

                        description:
                            step.description ||
                            "Verify the expected result.",

                        locatorStrategy:
                            null,

                        locator:
                            null,

                        actual:
                            step.actual ??
                            "",

                        operator:
                            normalizeAssertOperator(
                                step.operator,
                            ),

                        expected:
                            step.expected ??
                            "",
                    });
                }

                return step;
            });

    if (
        steps.length ===
        0
    ) {
        return null;
    }

    const invalidStep =
        steps.find(
            (step) => {
                if (
                    step.action ===
                    "assert"
                ) {
                    return (
                        !step.actual ||
                        !step.expected
                    );
                }

                return false;
            },
        );

    if (invalidStep) {
        throw new Error(
            `Invalid assert step "${invalidStep.title}": actual and expected are required.`,
        );
    }

    return {
        type: "flow_plan",

        summary:
            plan.summary ||
            "Generated flow plan.",

        steps,

        warnings:
            Array.isArray(
                plan.warnings,
            )
                ? plan.warnings
                : [],
    };
}

function getAIFlowContext(
    context,
) {
    if (
        context?.flow &&
        typeof context.flow ===
            "object"
    ) {
        return context.flow;
    }

    return context;
}

function buildExecutionAnalysisMessage(
    context,
    language = "id",
) {
    const execution =
        context?.execution;

    const environment =
        context?.environment;

    if (
        !execution ||
        typeof execution !==
            "object"
    ) {
        return "";
    }

    const lines = [];

    const status =
        execution.status;

    const statistics =
        execution.statistics;

    const timing =
        execution.timing;

    const isEnglish =
        language === "en";

    /*
     * --------------------------------------------------
     * Execution summary
     * --------------------------------------------------
     */

    lines.push(
        isEnglish
            ? "### Execution"
            : "### Eksekusi",
    );

    if (status) {
        lines.push(
            `Status: ${status}`,
        );
    }

    if (statistics) {
        const executed =
            statistics.executedNodes ??
            0;

        const total =
            statistics.totalNodes ??
            0;

        const passed =
            statistics.passedNodes ??
            0;

        const failed =
            statistics.failedNodes ??
            0;

        const skipped =
            statistics.skippedNodes ??
            0;

        lines.push(
            `Progress: ${statistics.progress ?? 0}%`,
            isEnglish
                ? `Passed: ${passed}/${total}`
                : `Passed: ${passed}/${total}`,
            isEnglish
                ? `Failed: ${failed}`
                : `Failed: ${failed}`,
            isEnglish
                ? `Skipped: ${skipped}`
                : `Skipped: ${skipped}`,
            isEnglish
                ? `Executed: ${executed}/${total}`
                : `Dieksekusi: ${executed}/${total}`,
        );
    }

    /*
     * --------------------------------------------------
     * Environment
     * --------------------------------------------------
     */

    if (environment) {
        const environmentParts = [];

        if (
            environment.platform
        ) {
            const platform =
                environment.platform;

            const version =
                environment.platformVersion;

            environmentParts.push(
                version
                    ? `${platform} ${version}`
                    : platform,
            );
        }

        if (
            environment.deviceName
        ) {
            environmentParts.push(
                environment.deviceName,
            );
        }

        if (
            environment.appiumConnection
        ) {
            environmentParts.push(
                `Appium: ${environment.appiumConnection}`,
            );
        }

        if (
            environmentParts.length > 0
        ) {
            lines.push(
                "",
                isEnglish
                    ? "### Environment"
                    : "### Environment",
                environmentParts.join(
                    " — ",
                ),
            );
        }
    }

    /*
     * --------------------------------------------------
     * Failed nodes
     * --------------------------------------------------
     */

    const nodeResults =
    execution.nodeResults;

const flowContext =
    getAIFlowContext(
        context,
    );

const flowNodes =
    Array.isArray(
        flowContext?.nodes,
    )
        ? flowContext.nodes
        : [];

const flowNodeMap =
    new Map(
        flowNodes.map(
            (node) => [
                node.id,
                node,
            ],
        ),
    );

    if (
        nodeResults &&
        typeof nodeResults ===
            "object"
    ) {
        const failedResults =
            Object.values(
                nodeResults,
            ).filter(
                (result) =>
                    result &&
                    result.status ===
                        "failed",
            );

        if (
            failedResults.length > 0
        ) {
            lines.push(
                "",
                isEnglish
                    ? "### Failure"
                    : "### Kegagalan",
            );

            for (
                const result of
                    failedResults
            ) {

                const flowNode =
                flowNodeMap.get(
                    result.nodeId,
    );
                const failureDetails = [
    `Node: ${
        flowNode?.title ||
        result.nodeTitle ||
        result.nodeId
    }`,

    `ID: ${result.nodeId}`,
];

if (flowNode?.action) {
    failureDetails.push(
        `Action: ${flowNode.action}`,
    );
}

if (result.locatorStrategy) {
    failureDetails.push(
        `Locator strategy: ${result.locatorStrategy}`,
    );
}

if (result.locator) {
    failureDetails.push(
        `Locator: ${result.locator}`,
    );
}

if (result.error) {
    failureDetails.push(
        `Error: ${result.error}`,
    );
}

if (
    result.duration !==
    undefined
) {
    failureDetails.push(
        `Duration: ${Math.round(
            result.duration,
        )}ms`,
    );
}

if (
    result.screenshotFileName
) {
    failureDetails.push(
        `Screenshot: ${result.screenshotFileName}`,
    );
}

if (
    result.pageSource
) {
    lines.push(
        isEnglish
            ? "Page source: available"
            : "Page source: tersedia",
    );
}

lines.push(
    ...failureDetails,
);

lines.push("");
            }
        }
    }

    /*
     * --------------------------------------------------
     * Total execution duration
     * --------------------------------------------------
     */

    if (
        timing &&
        typeof timing.duration ===
            "number"
    ) {
        const durationSeconds =
            timing.duration /
            1000;

        const formattedDuration =
            durationSeconds >= 60
                ? `${(
                      durationSeconds /
                      60
                  ).toFixed(1)}m`
                : `${durationSeconds.toFixed(
                      1,
                  )}s`;

        lines.push(
            isEnglish
                ? `Total duration: ${formattedDuration}`
                : `Total durasi: ${formattedDuration}`,
        );
    }

     /*
 * --------------------------------------------------
 * Failure diagnosis
 * --------------------------------------------------
 */

if (
    nodeResults &&
    typeof nodeResults ===
        "object"
) {
    const failedResult =
        Object.values(
            nodeResults,
        ).find(
            (result) =>
                result &&
                result.status ===
                    "failed",
        );

    if (failedResult) {
        const failedLocator =
            failedResult.locator;

        const failedPageSource =
            failedResult.pageSource;

        if (
            failedLocator &&
            failedPageSource
        ) {
            const locatorMatch =
                failedLocator.match(
                    /name\s*==\s*["']([^"']+)["']/i,
                );

            const configuredValue =
                locatorMatch?.[1]?.trim();

            if (
                configuredValue
            ) {
                const configuredExists =
                    failedPageSource.includes(
                        configuredValue,
                    );

                if (
                    !configuredExists
                ) {
                    lines.push(
                        "",
                        isEnglish
                            ? "### Diagnosis"
                            : "### Diagnosis",
                        isEnglish
                            ? `The node failed because the configured locator uses "${configuredValue}", but that value was not found in the current page source.`
                            : `Node gagal karena locator yang digunakan memakai "${configuredValue}", tetapi nilai tersebut tidak ditemukan pada page source saat ini.`,
                        isEnglish
                            ? "This indicates that the configured locator does not match the element currently present in the UI."
                            : "Ini menunjukkan bahwa locator yang dikonfigurasi tidak cocok dengan element yang tersedia pada UI saat execution gagal.",
                    );
                }
            }
        }
    }
}

    return lines
        .join("\n")
        .replace(
            /\n{3,}/g,
            "\n\n",
        )
        .trim();
}

function buildFlowAnalysisMessage(
    context,
    language = "id",
) {
        const flowContext =
        getAIFlowContext(
            context,
        );

    const nodes = Array.isArray(
        flowContext?.nodes,
    )
        ? flowContext.nodes
        : [];

    const edges = Array.isArray(
        flowContext?.edges,
    )
        ? flowContext.edges
        : [];

    if (nodes.length === 0) {
        return language === "en"
            ? "The current flow is empty. There are no nodes or edges yet."
            : "Flow saat ini masih kosong. Belum ada node atau edge yang dibuat.";
    }

    const nodeMap =
        new Map(
            nodes.map((node) => [
                node.id,
                node,
            ]),
        );

    const outgoing =
        new Map();

    const incomingCount =
        new Map();

    for (const edge of edges) {
        const outgoingEdges =
            outgoing.get(
                edge.source,
            ) ?? [];

        outgoingEdges.push(edge);

        outgoing.set(
            edge.source,
            outgoingEdges,
        );

        incomingCount.set(
            edge.target,
            (
                incomingCount.get(
                    edge.target,
                ) ?? 0
            ) + 1,
        );
    }

    const startNodes =
        nodes.filter(
            (node) =>
                !incomingCount.has(
                    node.id,
                ),
        );

    const orderedNodes = [];

    function describeFlowNarrative(
    nodes,
    language,
) {
    const descriptions =
        [];

    for (
        const node of nodes
    ) {
        const action =
            node.action;

        if (
            action ===
            "launchApp"
        ) {
            descriptions.push(
                language === "en"
                    ? "launches the application"
                    : "membuka aplikasi",
            );

            continue;
        }

        if (
    action ===
    "getDisplayed"
) {
    const target =
        node.details?.elementName ??
        node.title?.trim() ??
        "an element";

    descriptions.push(
        language === "en"
            ? `checks whether ${String(target)} is visible`
            : `memastikan ${String(target)} terlihat`,
    );

    continue;
}

if (
    action ===
    "tap"
) {
    const target =
        node.title?.trim() ??
        "an element";

    descriptions.push(
        language === "en"
            ? `taps ${String(target).replace(/^Tap\s+/i, "")}`
            : `menekan ${String(target).replace(/^Tap\s+/i, "")}`,
    );

    continue;
}

if (
    action ===
    "wait"
) {
    const target =
        node.title?.trim() ??
        "the element";

    descriptions.push(
        language === "en"
            ? `waits for ${String(target).replace(/^Wait(?: Until Element)?\s*/i, "")}`
            : `menunggu ${String(target).replace(/^Wait(?: Until Element)?\s*/i, "")}`,
    );

    continue;
}

        if (
            action ===
            "getText"
        ) {
            descriptions.push(
                language === "en"
                    ? "reads text from an element"
                    : "mengambil teks dari sebuah elemen",
            );

            continue;
        }

        if (
            action ===
            "input"
        ) {
            const text =
                node.details?.text ??
                "";

            descriptions.push(
                language === "en"
                    ? text
                        ? `enters "${String(
                              text,
                          )}"`
                        : "enters text"
                    : text
                      ? `mengisi "${String(
                            text,
                        )}"`
                      : "mengisi teks",
            );

            continue;
        }

        if (
            action ===
            "pressReturn"
        ) {
            descriptions.push(
                language === "en"
                    ? "presses Return"
                    : "menekan Return",
            );

            continue;
        }

        descriptions.push(
            language === "en"
                ? `performs ${action}`
                : `menjalankan ${action}`,
        );
    }

    if (
        descriptions.length ===
        0
    ) {
        return "";
    }

    if (
        language === "en"
    ) {
        if (
            descriptions.length ===
            1
        ) {
            return `This flow ${descriptions[0]}.`;
        }

        const last =
            descriptions.at(-1);

        const beginning =
            descriptions
                .slice(
                    0,
                    -1,
                )
                .join(
                    ", ",
                );

        return `This flow ${beginning}, and ${last}.`;
    }

    if (
        descriptions.length ===
        1
    ) {
        return `Flow ini ${descriptions[0]}.`;
    }

    const last =
        descriptions.at(-1);

    const beginning =
        descriptions
            .slice(
                0,
                -1,
            )
            .join(
                ", ",
            );

    return `Flow ini ${beginning}, lalu ${last}.`;
}

    const visited =
        new Set();

    function visit(nodeId) {
        if (
            visited.has(
                nodeId,
            )
        ) {
            return;
        }

        const node =
            nodeMap.get(
                nodeId,
            );

        if (!node) {
            return;
        }

        visited.add(nodeId);

        orderedNodes.push(
            node,
        );

        const nextEdges =
            outgoing.get(
                nodeId,
            ) ?? [];

        for (
            const edge of nextEdges
        ) {
            visit(edge.target);
        }
    }

    for (
        const node of startNodes
    ) {
        visit(node.id);
    }

    for (
        const node of nodes
    ) {
        visit(node.id);
    }

    function getNodeDetail(node) {
        const parts = [];

        if (
            node.locatorStrategy &&
            node.locator
        ) {
            parts.push(
                `${node.locatorStrategy}=${node.locator}`,
            );
        }

        if (
            node.details &&
            typeof node.details ===
                "object"
        ) {
            const details =
                Object.entries(
                    node.details,
                ).filter(
                    ([, value]) =>
                        value !==
                            null &&
                        value !==
                            undefined &&
                        value !== "",
                );

            for (
                const [
                    key,
                    value,
                ] of details.slice(
                    0,
                    4,
                )
            ) {
                parts.push(
                    `${key}=${String(value)}`,
                );
            }
        }

        return parts.length > 0
            ? ` [${parts.join(", ")}]`
            : "";
    }

    function getFriendlyAction(
        node,
    ) {
        const title =
            node.title?.trim();

        if (title) {
            return title;
        }

        const action =
            node.action;

        const labels = {
            launchApp:
                "Launch App",
            closeApp:
                "Close App",
            tap: "Tap Element",
            input:
                "Input Text",
            assert:
                "Verify Condition",
            wait:
                "Wait for Element",
            delay:
                "Delay",
            getText:
                "Get Text",
            getDisplayed:
                "Check Visibility",
            getEnabled:
                "Check Enabled State",
            getSelected:
                "Check Selected State",
            elementExists:
                "Check Element Exists",
            setVariable:
                "Set Variable",
            pressReturn:
                "Press Return",
            hideKeyboard:
                "Hide Keyboard",
            screenshot:
                "Take Screenshot",
            back:
                "Press Back",
            home:
                "Go Home",
        };

        return (
            labels[action] ??
            action
        );
    }

    function getStepDescription(
        node,
    ) {
        const title =
            getFriendlyAction(
                node,
            );

        const detail =
            getNodeDetail(
                node,
            );

        if (
            node.subtitle?.trim()
        ) {
            return `${title}${detail} — ${node.subtitle.trim()}`;
        }

        return `${title}${detail}`;
    }

    const actionCounts =
        new Map();

    for (
        const node of nodes
    ) {
        actionCounts.set(
            node.action,
            (
                actionCounts.get(
                    node.action,
                ) ?? 0
            ) + 1,
        );
    }

    function countAction(
        action,
    ) {
        return (
            actionCounts.get(
                action,
            ) ?? 0
        );
    }

    const assertionCount =
        countAction("assert");

    const inputCount =
        countAction("input");

    const tapCount =
        countAction("tap");

    const waitCount =
        countAction("wait");

    const getterCount =
        [
            "getText",
            "getDisplayed",
            "getEnabled",
            "getSelected",
            "elementExists",
            "getAttribute",
            "getLocation",
            "getSize",
            "getRect",
        ].reduce(
            (
                total,
                action,
            ) =>
                total +
                countAction(
                    action,
                ),
            0,
        );

    const branchingNodes =
        nodes.filter(
            (node) => {
                const outgoingEdges =
                    outgoing.get(
                        node.id,
                    ) ?? [];

                return (
                    outgoingEdges.length >
                    1
                );
            },
        );

    const reviewPoints = [];

    const xpathCount =
        nodes.filter(
            (node) =>
                node.locatorStrategy ===
                "xpath",
        ).length;

    if (
        xpathCount > 0
    ) {
        reviewPoints.push(
            language === "en"
                ? `${xpathCount} node(s) use XPath locators. Consider verifying their stability.`
                : `${xpathCount} node menggunakan locator XPath. Sebaiknya periksa kembali kestabilan locator tersebut.`,
        );
    }

    const locatorNodes =
        nodes.filter(
            (node) =>
                node.action ===
                    "tap" ||
                node.action ===
                    "input" ||
                node.action ===
                    "wait" ||
                node.action ===
                    "getText" ||
                node.action ===
                    "getDisplayed" ||
                node.action ===
                    "getEnabled" ||
                node.action ===
                    "getSelected" ||
                node.action ===
                    "elementExists",
        );

    const missingLocators =
        locatorNodes.filter(
            (node) =>
                !node.locator ||
                !node.locatorStrategy,
        );

    if (
        missingLocators.length > 0
    ) {
        reviewPoints.push(
            language === "en"
                ? `${missingLocators.length} locator-based node(s) are missing locator data.`
                : `${missingLocators.length} node berbasis locator belum memiliki data locator yang lengkap.`,
        );
    }

    if (
        branchingNodes.length > 0
    ) {
        reviewPoints.push(
            language === "en"
                ? `${branchingNodes.length} branching node(s) were detected.`
                : `Ditemukan ${branchingNodes.length} node yang memiliki branching.`,
        );
    }

    if (
        assertionCount === 0
    ) {
        reviewPoints.push(
            language === "en"
                ? "No assertion node was found in the current flow."
                : "Belum ada node assertion pada flow saat ini.",
        );
    }   

    const narrative =
    describeFlowNarrative(
        orderedNodes,
        language,
    );

    const stepLines =
        orderedNodes.map(
            (
                node,
                index,
            ) =>
                `${index + 1}. ${getStepDescription(
                    node,
                )}`,
        );

    const summaryParts = [];

    if (
        inputCount > 0
    ) {
        summaryParts.push(
            `${inputCount} input`,
        );
    }

    if (
        tapCount > 0
    ) {
        summaryParts.push(
            `${tapCount} tap`,
        );
    }

    if (
        assertionCount > 0
    ) {
        summaryParts.push(
            `${assertionCount} assertion`,
        );
    }

    if (
        waitCount > 0
    ) {
        summaryParts.push(
            `${waitCount} wait`,
        );
    }

    if (
        getterCount > 0
    ) {
        summaryParts.push(
            `${getterCount} element getter`,
        );
    }

    if (language === "en") {
        let message =
    "## Flow Overview\n\n";

if (narrative) {
    message +=
        `${narrative}\n\n`;
}

        message +=
            `The current flow contains ${nodes.length} nodes and ${edges.length} edges.\n\n`;

        message +=
            "## Steps\n\n";

        message +=
            `${stepLines.join(
                "\n",
            )}\n\n`;

        message +=
            "## Summary\n\n";

        message +=
            summaryParts.length > 0
                ? `${summaryParts.join(
                      " • ",
                  )}.`
                : "No action summary available.";

        if (
            branchingNodes.length >
            0
        ) {
            message +=
                `\n\n${branchingNodes.length} branching node(s) were detected.`;
        }

        if (
            reviewPoints.length > 0
        ) {
            message +=
                "\n\n## Review Points\n\n";

            message += reviewPoints
                .map(
                    (point) =>
                        `- ${point}`,
                )
                .join(
                    "\n",
                );
        }

        return message;
    }

    let message =
    "## Ringkasan Flow\n\n";

if (narrative) {
    message +=
        `${narrative}\n\n`;
}

    message +=
        `Flow saat ini memiliki ${nodes.length} node dan ${edges.length} edge.\n\n`;

    message +=
        "## Urutan Flow\n\n";

    message +=
        `${stepLines.join(
            "\n",
        )}\n\n`;

    message +=
        "## Summary\n\n";

    message +=
        summaryParts.length > 0
            ? `${summaryParts.join(
                  " • ",
              )}.`
            : "Belum ada ringkasan action.";

    if (
        branchingNodes.length >
        0
    ) {
        message +=
            `\n\nTerdapat ${branchingNodes.length} node yang memiliki branching.`;
    }

    if (
        reviewPoints.length > 0
    ) {
        message +=
            "\n\n## Hal yang Perlu Ditinjau\n\n";

        message += reviewPoints
            .map(
                (point) =>
                    `- ${point}`,
            )
            .join(
                "\n",
            );
    }

    return message;
}

function buildSelectedNodeAnalysisMessage(
    context,
    language = "id",
) {
    const flowContext =
        getAIFlowContext(
            context,
        );

    const node =
        flowContext?.selectedNode;

    if (!node) {
        return language === "en"
            ? "No node is currently selected. Select a node in the flow first, then ask me to explain it."
            : "Belum ada node yang dipilih. Pilih sebuah node pada flow terlebih dahulu, lalu minta saya menjelaskannya.";
    }

    const nodes =
        Array.isArray(
            flowContext?.nodes,
        )
            ? flowContext.nodes
            : [];

    const edges =
    Array.isArray(
        flowContext?.edges,
    )
        ? flowContext.edges
        : [];

    const nodeMap =
        new Map(
            nodes.map(
                (item) => [
                    item.id,
                    item,
                ],
            ),
        );

    const incomingEdges =
        edges.filter(
            (edge) =>
                edge.target ===
                node.id,
        );

    const outgoingEdges =
        edges.filter(
            (edge) =>
                edge.source ===
                node.id,
        );

    const previousNodes =
        incomingEdges
            .map((edge) =>
                nodeMap.get(
                    edge.source,
                ),
            )
            .filter(Boolean);

    const nextNodes =
        outgoingEdges
            .map((edge) =>
                nodeMap.get(
                    edge.target,
                ),
            )
            .filter(Boolean);

    const details =
        node.details &&
        typeof node.details ===
            "object"
            ? Object.entries(
                  node.details,
              ).filter(
                  ([, value]) =>
                      value !==
                          null &&
                      value !==
                          undefined &&
                      value !== "",
              )
            : [];

    const lines = [];

    if (language === "en") {
        lines.push(
            "## Selected Node",
        );

        lines.push(
            `${node.title || node.action}`,
        );

        lines.push(
            "",
            "## Action",
            node.action,
        );

        if (
            node.subtitle?.trim()
        ) {
            lines.push(
                "",
                "## Description",
                node.subtitle.trim(),
            );
        }

        if (
            node.locatorStrategy &&
            node.locator
        ) {
            lines.push(
                "",
                "## Locator",
                `${node.locatorStrategy}=${node.locator}`,
            );
        }

        if (
            details.length > 0
        ) {
            lines.push(
                "",
                "## Details",
            );

            for (
                const [
                    key,
                    value,
                ] of details
            ) {
                lines.push(
                    `- ${key}: ${String(value)}`,
                );
            }
        }

        lines.push(
            "",
            "## Position in Flow",
            `Previous nodes: ${
                previousNodes.length
            }`,
            `Next nodes: ${
                nextNodes.length
            }`,
        );

        if (
            previousNodes.length >
            0
        ) {
            lines.push(
                `Previous: ${previousNodes
                    .map(
                        (item) =>
                            item.title ||
                            item.action,
                    )
                    .join(
                        ", ",
                    )}`,
            );
        }

        if (
            nextNodes.length > 0
        ) {
            lines.push(
                `Next: ${nextNodes
                    .map(
                        (item) =>
                            item.title ||
                            item.action,
                    )
                    .join(
                        ", ",
                    )}`,
            );
        }

        if (
            outgoingEdges.length >
                1
        ) {
            lines.push(
                "",
                "## Branching",
                "This node has multiple outgoing branches.",
            );
        }

        lines.push(
            "",
            "## Review",
        );

        if (
            node.locatorStrategy ===
            "xpath"
        ) {
            lines.push(
                "The node uses XPath. Verify that the locator is stable on the target device.",
            );
        } else if (
            node.locator &&
            node.locatorStrategy
        ) {
            lines.push(
                "The node has a locator strategy and locator configured.",
            );
        } else if (
            [
                "tap",
                "input",
                "wait",
                "getText",
                "getDisplayed",
                "getEnabled",
                "getSelected",
                "elementExists",
            ].includes(
                node.action,
            )
        ) {
            lines.push(
                "This locator-based node does not currently have complete locator data.",
            );
        } else {
            lines.push(
                "No immediate locator-related issue was detected for this node.",
            );
        }

        return lines.join(
            "\n",
        );
    }

    lines.push(
        "## Node yang Dipilih",
    );

    lines.push(
        node.title ||
            node.action,
    );

    lines.push(
        "",
        "## Action",
        node.action,
    );

    if (
        node.subtitle?.trim()
    ) {
        lines.push(
            "",
            "## Deskripsi",
            node.subtitle.trim(),
        );
    }

    if (
        node.locatorStrategy &&
        node.locator
    ) {
        lines.push(
            "",
            "## Locator",
            `${node.locatorStrategy}=${node.locator}`,
        );
    }

    if (
        details.length > 0
    ) {
        lines.push(
            "",
            "## Detail",
        );

        for (
            const [
                key,
                value,
            ] of details
        ) {
            lines.push(
                `- ${key}: ${String(value)}`,
            );
        }
    }

    lines.push(
        "",
        "## Posisi di Flow",
        `Node sebelumnya: ${previousNodes.length}`,
        `Node berikutnya: ${nextNodes.length}`,
    );

    if (
        previousNodes.length >
        0
    ) {
        lines.push(
            `Sebelumnya: ${previousNodes
                .map(
                    (item) =>
                        item.title ||
                        item.action,
                )
                .join(", ")}`,
        );
    }

    if (
        nextNodes.length > 0
    ) {
        lines.push(
            `Berikutnya: ${nextNodes
                .map(
                    (item) =>
                        item.title ||
                        item.action,
                )
                .join(", ")}`,
        );
    }

    if (
        outgoingEdges.length > 1
    ) {
        lines.push(
            "",
            "## Branching",
            "Node ini memiliki lebih dari satu cabang keluaran.",
        );
    }

    lines.push(
        "",
        "## Review",
    );

    if (
        node.locatorStrategy ===
        "xpath"
    ) {
        lines.push(
            "Node menggunakan XPath. Sebaiknya verifikasi kestabilan locator pada device target.",
        );
    } else if (
        node.locator &&
        node.locatorStrategy
    ) {
        lines.push(
            "Node sudah memiliki locator strategy dan locator.",
        );
    } else if (
        [
            "tap",
            "input",
            "wait",
            "getText",
            "getDisplayed",
            "getEnabled",
            "getSelected",
            "elementExists",
        ].includes(
            node.action,
        )
    ) {
        lines.push(
            "Node berbasis locator ini belum memiliki data locator yang lengkap.",
        );
    } else {
        lines.push(
            "Tidak ditemukan masalah locator langsung pada node ini.",
        );
    }

    return lines.join(
        "\n",
    );
}

function normalizeModificationPlan(
    rawPlan,
    context,
    message = "",
) {
    if (
        !rawPlan ||
        typeof rawPlan !== "object"
    ) {
        return null;
    }

    function normalizeModificationOperationType(
        value,
    ) {
        if (
            typeof value !==
            "string"
        ) {
            return null;
        }

        if (
            value === "deleteNode" ||
            value === "deleteNodeAfter"
        ) {
            return "deleteNode";
        }

        if (
            value === "addNodeAfter"
        ) {
            return "addNodeAfter";
        }

        if (
            value === "addNodeBefore"
        ) {
            return "addNodeBefore";
        }

        if (
            value === "updateNode"
        ) {
            return "updateNode";
        }

        return null;
    }

    /*
     * --------------------------------------------------
     * Normalize one modification operation.
     * --------------------------------------------------
     */

    function normalizeOneOperation(
    rawOperation,
    operationIndex = 0,
) {
        if (
            !rawOperation ||
            typeof rawOperation !==
                "object"
        ) {
            return null;
        }

        const operationType =
            normalizeModificationOperationType(
                rawOperation.type ??
                rawOperation.action,
            );

        if (!operationType) {
            return null;
        }

       /*
 * --------------------------------------------------
 * Resolve target node.
 *
 * When the user explicitly refers to
 * "the selected node", the first modification
 * must use the selected node from FlowTest Studio
 * as the source of truth.
 *
 * Subsequent operations keep their explicit
 * targetNodeId because they may refer to another
 * existing node, for example an assertion after
 * the selected node.
 * --------------------------------------------------
 */

const targetNodeId =
    resolveModificationTarget({
        operation:
            rawOperation,

        context,

        message,
    });

    /*
 * --------------------------------------------------
 * Normalize operation direction from the user's
 * natural-language request.
 *
 * The user's explicit "before"/"after" wording
 * has priority over an incorrect operation type
 * returned by the model.
 * --------------------------------------------------
 */

const normalizedRequest =
    typeof message ===
        "string"
        ? message
            .toLowerCase()
            .trim()
        : "";

const explicitlyBefore =
    /\b(sebelum|before)\b/i.test(
        normalizedRequest,
    );

const explicitlyAfter =
    /\b(setelah|after)\b/i.test(
        normalizedRequest,
    );

let normalizedOperationType =
    operationType;

if (
    (
        operationType ===
            "addNodeBefore" ||
        operationType ===
            "addNodeAfter"
    ) &&
    explicitlyBefore &&
    !explicitlyAfter
) {
    normalizedOperationType =
        "addNodeBefore";
}

if (
    (
        operationType ===
            "addNodeBefore" ||
        operationType ===
            "addNodeAfter"
    ) &&
    explicitlyAfter &&
    !explicitlyBefore
) {
    normalizedOperationType =
        "addNodeAfter";
}
        /*
         * Make sure the target exists in the
         * current FlowTest Studio context.
         */
        const nodes =
            Array.isArray(
                context?.nodes,
            )
                ? context.nodes
                : [];

        if (
            nodes.length > 0 &&
            !nodes.some(
                (node) =>
                    node?.id ===
                    targetNodeId,
            )
        ) {
            return null;
        }

        /*
         * deleteNode does not have a step.
         */
        if (
            operationType ===
            "deleteNode"
        ) {
            return {
                type:
                    "deleteNode",

                targetNodeId,
            };
        }

        /*
         * Resolve the step.
         *
         * Supported formats:
         *
         * operation.step
         * rawOperation.step
         */
        const rawStep =
            rawOperation.step;

        if (
            !rawStep ||
            typeof rawStep !==
                "object"
        ) {
            return null;
        }

        const action =
            typeof rawStep.action ===
            "string"
                ? rawStep.action
                : "";

        if (
            !VALID_ACTIONS.has(
                action,
            )
        ) {
            return null;
        }

        /*
         * --------------------------------------------------
         * Locator strategy
         * --------------------------------------------------
         */

        const locatorStrategy =
            typeof rawStep.locatorStrategy ===
                "string" &&
            VALID_LOCATOR_STRATEGIES.has(
                rawStep.locatorStrategy,
            )
                ? rawStep.locatorStrategy
                : action === "tap" ||
                    action === "input"
                    ? "accessibilityId"
                    : null;

        /*
         * --------------------------------------------------
         * Action-specific fields
         * --------------------------------------------------
         */

        let text = null;

        let duration = null;

        let actual = null;

        let operator = null;

        let expected = null;

        let variableName = null;

        let timeout = null;

        let pollingInterval = null;

        /*
         * input
         */

        if (
            action === "input"
        ) {
            text =
                typeof rawStep.text ===
                    "string"
                    ? rawStep.text
                    : typeof rawStep.value ===
                        "string"
                        ? rawStep.value
                        : null;
        }

        /*
         * delay / gesture duration
         */

        if (
            action === "delay" ||
            action === "longPress" ||
            action === "drag" ||
            action === "pinch" ||
            action === "zoom"
        ) {
            duration =
                typeof rawStep.duration ===
                    "number"
                    ? rawStep.duration
                    : null;
        }

        /*
         * assert / if
         */

        if (
            action === "assert" ||
            action === "if"
        ) {
            actual =
                typeof rawStep.actual ===
                    "string"
                    ? rawStep.actual
                    : null;

            operator =
                normalizeAssertOperator(
                    rawStep.operator,
                );

            expected =
                typeof rawStep.expected ===
                    "string"
                    ? rawStep.expected
                    : null;
        }

        /*
         * Actions that produce a value.
         */

        if (
            [
                "getText",
                "elementExists",
                "getAttribute",
                "getDisplayed",
                "getEnabled",
                "getSelected",
                "getLocation",
                "getSize",
                "getRect",
                "getCurrentActivity",
                "getCurrentPackage",
                "getOrientation",
                "getPlatformVersion",
                "getDeviceName",
                "getDeviceTime",
            ].includes(
                action,
            )
        ) {
            variableName =
                typeof rawStep.variableName ===
                    "string"
                    ? rawStep.variableName
                    : null;
        }

        /*
         * wait
         */

        if (
            action === "wait"
        ) {
            timeout =
                typeof rawStep.timeout ===
                    "number"
                    ? rawStep.timeout
                    : null;

            pollingInterval =
                typeof rawStep.pollingInterval ===
                    "number"
                    ? rawStep.pollingInterval
                    : null;
        }

        /*
         * --------------------------------------------------
         * Canonical normalized operation
         * --------------------------------------------------
         */

        return {
    type:
        normalizedOperationType,

    targetNodeId,

    step: {
                action,

                title:
                    typeof rawStep.title ===
                    "string"
                        ? rawStep.title
                        : action,

                description:
                    typeof rawStep.description ===
                    "string"
                        ? rawStep.description
                        : typeof rawStep.subtitle ===
                            "string"
                            ? rawStep.subtitle
                            : `Execute ${action}.`,

                locatorStrategy,

                locator:
                    typeof rawStep.locator ===
                    "string"
                        ? rawStep.locator
                        : null,

                text,

                duration,

                actual,

                operator,

                expected,

                variableName,

                timeout:
    action === "wait"
        ? (
            typeof timeout ===
                "number"
                ? timeout
                : 10000
        )
        : null,

pollingInterval:
    action === "wait"
        ? (
            typeof pollingInterval ===
                "number" &&
            pollingInterval > 0
                ? pollingInterval
                : 500
        )
        : null,
            },
        };
    }

    /*
     * --------------------------------------------------
     * Collect raw operations
     * --------------------------------------------------
     */

    const rawOperations = [];

    /*
     * 1. Canonical multi-operation format:
     *
     * {
     *   type: "modification_plan",
     *   operations: [...]
     * }
     */

    if (
        rawPlan.type ===
            "modification_plan" &&
        Array.isArray(
            rawPlan.operations,
        )
    ) {
        rawOperations.push(
            ...rawPlan.operations,
        );
    }

    /*
     * 2. Canonical single-operation format:
     *
     * {
     *   type: "modification_plan",
     *   operation: {...}
     * }
     */

    if (
        rawPlan.type ===
            "modification_plan" &&
        rawPlan.operation &&
        typeof rawPlan.operation ===
            "object"
    ) {
        rawOperations.push(
            rawPlan.operation,
        );
    }

    /*
     * 3. Hybrid Qwen format:
     *
     * {
     *   type: "updateNode",
     *   targetNodeId: "...",
     *   operation: {...}
     * }
     */

    if (
        (
            rawPlan.type ===
                "addNodeAfter" ||
            rawPlan.type ===
                "addNodeBefore" ||
            rawPlan.type ===
                "updateNode"
        ) &&
        rawPlan.operation &&
        typeof rawPlan.operation ===
            "object"
    ) {
        rawOperations.push({
            type:
                rawPlan.operation.type ??
                rawPlan.type,

            targetNodeId:
                rawPlan.targetNodeId ??
                rawPlan.operation
                    .targetNodeId ??
                null,

            step:
                rawPlan.operation.step ??
                rawPlan.step ??
                null,
        });
    }

    /*
     * 4. Compact format:
     *
     * {
     *   type: "updateNode",
     *   targetNodeId: "...",
     *   step: {...}
     * }
     */

    if (
        (
            rawPlan.type ===
                "addNodeAfter" ||
            rawPlan.type ===
                "addNodeBefore" ||
            rawPlan.type ===
                "updateNode"
        ) &&
        rawPlan.step &&
        typeof rawPlan.step ===
            "object"
    ) {
        rawOperations.push({
            type:
                rawPlan.type,

            targetNodeId:
                rawPlan.targetNodeId ??
                null,

            step:
                rawPlan.step,
        });
    }

    /*
 * 5. Compact deleteNode format:
 *
 * {
 *   type: "deleteNode",
 *   targetNodeId: "..."
 * }
 */

if (
    rawPlan.type ===
    "deleteNode"
) {
    rawOperations.push({
        type:
            "deleteNode",

        targetNodeId:
            rawPlan.targetNodeId ??
            context?.selectedNodeId ??
            null,
    });
}

    /*
     * 6. Qwen generateFlow-style fallback:
     *
     * {
     *   steps: [...]
     * }
     */

    if (
        rawOperations.length ===
            0 &&
        Array.isArray(
            rawPlan.steps,
        ) &&
        rawPlan.steps.length > 0
    ) {
        for (
            const rawEntry of
            rawPlan.steps
        ) {
            if (
                !rawEntry ||
                typeof rawEntry !==
                    "object"
            ) {
                continue;
            }

            const nestedOperation =
                rawEntry.operation &&
                typeof rawEntry.operation ===
                    "object"
                    ? rawEntry.operation
                    : null;

            const requestedType =
                normalizeModificationOperationType(
                    nestedOperation?.type ??
                    rawEntry.action,
                );

            if (!requestedType) {
                continue;
            }

            

            if (!targetNodeId) {
                continue;
            }

            if (
                requestedType ===
                "deleteNode"
            ) {
                rawOperations.push({
                    type:
                        "deleteNode",

                    targetNodeId,
                });
            } else {
                rawOperations.push({
                    type:
                        requestedType,

                    targetNodeId,

                    step:
                        nestedOperation?.step ??
                        rawEntry.step ??
                        rawEntry,
                });
            }
        }
    }

    /*
     * Nothing found.
     */

    if (
        rawOperations.length ===
        0
    ) {
        return null;
    }

    /*
     * --------------------------------------------------
     * Normalize every operation.
     * --------------------------------------------------
     */

    const operations = [];

    for (
    const [
        operationIndex,
        rawOperation,
    ] of rawOperations.entries()
) {
    const normalized =
        normalizeOneOperation(
            rawOperation,
            operationIndex,
        );

    if (!normalized) {
        return null;
    }

    operations.push(
            normalized,
        );
    }

    /*
     * --------------------------------------------------
     * Return canonical modification plan.
     *
     * One operation:
     *   operation
     *
     * Multiple operations:
     *   operations
     * --------------------------------------------------
     */

    const summary =
        typeof rawPlan.summary ===
        "string" &&
        rawPlan.summary.trim()
            ? rawPlan.summary
            : operations.length ===
                1
                ? `Modify the flow using ${operations[0].step?.action ?? operations[0].type}.`
                : `Apply ${operations.length} modifications to the flow.`;

    const warnings = [
        "The modification target was resolved against the current FlowTest Studio context.",

        ...(Array.isArray(
            rawPlan.warnings,
        )
            ? rawPlan.warnings.filter(
                (warning) =>
                    typeof warning ===
                    "string",
            )
            : []),
    ];

    if (
        operations.length ===
        1
    ) {
        return {
            type:
                "modification_plan",

            summary,

            operation:
                operations[0],

            warnings,
        };
    }

    return {
        type:
            "modification_plan",

        summary,

        operations,

        warnings,
    };
}

export function resolveClarificationTarget({
    message,
    candidates,
}) {
    const clarificationCandidates =
        Array.isArray(candidates)
            ? candidates
            : [];

    if (
        clarificationCandidates.length === 0 ||
        typeof message !== "string"
    ) {
        return {
            candidateIndex: null,
            targetNodeId: null,
        };
    }

    const normalizedMessage =
        message
            .toLowerCase()
            .trim();

    let candidateIndex =
        null;

    if (
        /\bpertama\b|\bfirst\b/i.test(
            normalizedMessage,
        )
    ) {
        candidateIndex = 0;
    } else if (
        /\bkedua\b|\bsecond\b/i.test(
            normalizedMessage,
        )
    ) {
        candidateIndex = 1;
    } else if (
        /\bketiga\b|\bthird\b/i.test(
            normalizedMessage,
        )
    ) {
        candidateIndex = 2;
    } else if (
        /\bkeempat\b|\bfourth\b/i.test(
            normalizedMessage,
        )
    ) {
        candidateIndex = 3;
    } else if (
        /\bkelima\b|\bfifth\b/i.test(
            normalizedMessage,
        )
    ) {
        candidateIndex = 4;
    } else if (
        /\bterakhir\b|\blast\b/i.test(
            normalizedMessage,
        )
    ) {
        candidateIndex =
            clarificationCandidates.length - 1;
    } else {
        const numericMatch =
            normalizedMessage.match(
                /\b(?:ke[-\s]?)?(\d+)\b/i,
            );

        if (
            numericMatch
        ) {
            candidateIndex =
                Number(
                    numericMatch[1],
                ) - 1;
        }
    }

    if (
        candidateIndex === null ||
        candidateIndex < 0 ||
        candidateIndex >=
            clarificationCandidates.length
    ) {
        return {
            candidateIndex: null,
            targetNodeId: null,
        };
    }

    return {
        candidateIndex,

        targetNodeId:
            clarificationCandidates[
                candidateIndex
            ]?.nodeId ?? null,
    };
}

export async function generateAIResponse({
    message,
    context,
    clarification = null,
}) {

    /*
     * --------------------------------------------------
     * Resolve pending clarification
     * --------------------------------------------------
     *
     * Example:
     *
     * original request:
     * "Tambahkan wait sebelum Login"
     *
     * follow-up:
     * "yang kedua"
     *
     * The follow-up itself is NOT the modification
     * instruction. It only selects one of the
     * previously detected candidates.
     * --------------------------------------------------
     */

    const clarificationOriginalMessage =
        typeof clarification?.originalMessage ===
            "string" &&
        clarification.originalMessage.trim()
            ? clarification.originalMessage.trim()
            : null;

    const clarificationCandidates =
        Array.isArray(
            clarification?.clarification?.candidates,
        )
            ? clarification.clarification
                .candidates
            : [];

    const normalizedClarificationMessage =
        typeof message ===
            "string"
            ? message
                .toLowerCase()
                .trim()
            : "";

    function resolveClarificationCandidateIndex() {
        if (
            clarificationCandidates.length ===
            0
        ) {
            return null;
        }

        /*
         * --------------------------------------------------
         * Indonesian ordinal
         * --------------------------------------------------
         */

        if (
            /\bpertama\b/i.test(
                normalizedClarificationMessage,
            )
        ) {
            return 0;
        }

        if (
            /\bkedua\b/i.test(
                normalizedClarificationMessage,
            )
        ) {
            return 1;
        }

        if (
            /\bketiga\b/i.test(
                normalizedClarificationMessage,
            )
        ) {
            return 2;
        }

        if (
            /\bkeempat\b/i.test(
                normalizedClarificationMessage,
            )
        ) {
            return 3;
        }

        if (
            /\bkelima\b/i.test(
                normalizedClarificationMessage,
            )
        ) {
            return 4;
        }

        /*
         * --------------------------------------------------
         * English ordinal
         * --------------------------------------------------
         */

        if (
            /\bfirst\b/i.test(
                normalizedClarificationMessage,
            )
        ) {
            return 0;
        }

        if (
            /\bsecond\b/i.test(
                normalizedClarificationMessage,
            )
        ) {
            return 1;
        }

        if (
            /\bthird\b/i.test(
                normalizedClarificationMessage,
            )
        ) {
            return 2;
        }

        if (
            /\bfourth\b/i.test(
                normalizedClarificationMessage,
            )
        ) {
            return 3;
        }

        if (
            /\bfifth\b/i.test(
                normalizedClarificationMessage,
            )
        ) {
            return 4;
        }

        /*
         * --------------------------------------------------
         * Numeric references
         * --------------------------------------------------
         *
         * Examples:
         *
         * "node 2"
         * "yang ke-2"
         * "number 2"
         * --------------------------------------------------
         */

        const numericMatch =
            normalizedClarificationMessage.match(
                /\b(?:ke[-\s]?)?(\d+)\b/i,
            );

        if (
            numericMatch
        ) {
            const numericIndex =
                Number(
                    numericMatch[1],
                ) - 1;

            if (
                numericIndex >= 0 &&
                numericIndex <
                    clarificationCandidates.length
            ) {
                return numericIndex;
            }
        }

        return null;
    }

    const clarificationTarget =
    clarificationOriginalMessage &&
    clarificationCandidates.length > 0
        ? resolveClarificationTarget({
            message,
            candidates:
                clarificationCandidates,
        })
        : {
            candidateIndex: null,
            targetNodeId: null,
        };

const clarificationCandidateIndex =
    clarificationTarget.candidateIndex;

const clarificationTargetNodeId =
    clarificationTarget.targetNodeId;

    /*
     * The original modification request is the
     * effective instruction when the user is answering
     * a pending clarification.
     */
    const effectiveMessage =
        clarificationOriginalMessage ??
        message;

    const intent =
    normalizeIntent(
        undefined,
        null,
        effectiveMessage,
    );

console.error(
    "[AI NORMALIZED INTENT]",
    intent,
);

if (
    intent ===
    "analyzeExecution"
) {
    const userLanguage =
        /[^\x00-\x7F]/.test(
            message,
        ) ||
        /\b(saya|flow|jelaskan|apa|yang|ini|tolong|buat|tambahkan)\b/i.test(
            message,
        )
            ? "id"
            : "en";

    const executionMessage =
        buildExecutionAnalysisMessage(
            context,
            userLanguage,
        );

    return {
        message:
            executionMessage ||
            (
                userLanguage ===
                "en"
                    ? "There is not enough execution evidence to analyze the failure."
                    : "Belum ada evidence execution yang cukup untuk menganalisis kegagalan."
            ),

        intent:
            "analyzeExecution",

        flowPlan:
            null,

        modificationPlan:
            null,
    };
}

    const systemPrompt = `
You are the AI Assistant for FlowTest Studio.

You support Indonesian and English.
Respond in the same language as the user.

The current FlowTest Studio context is the source of truth.

EXECUTION REASONING:

- The context may contain:
  - flow: the current flow structure.
  - execution: the latest execution state and node results.
  - environment: the current Appium/device environment.

- When analyzing execution results, treat context.execution as the source of truth for runtime behavior.

- Use context.execution.nodeResults to identify nodes that actually passed or failed.

- If a node has status "failed", inspect its error, duration, screenshotFileName, and pageSource availability when provided.

- Do not claim that a node failed based only on its flow configuration.

- Distinguish between:
  - a node configured in the flow,
  - a node that was executed,
  - a node that passed,
  - a node that failed,
  - a node that was skipped.

- Use context.execution.currentNodeId to identify the node currently being executed when available.

- Use context.execution.statistics to understand execution progress.

- Use context.environment to consider platform, device, Appium connection, and platform version when diagnosing runtime problems.

- If execution evidence is insufficient to determine the root cause, explicitly say that the evidence is insufficient instead of inventing a cause.

- When explaining a failure, prefer concrete execution evidence over assumptions.

INTENT ROUTING RULES:

- The server determines the authoritative intent before sending this request to the model.
- The requested intent is provided by the execution context of this request.
- For execution/failure analysis requests:
  - intent MUST be "analyzeExecution".
  - flowPlan MUST be null.
  - modificationPlan MUST be null.
  - Do not return "analyzeSelectedNode".
  - Do not return "modifyFlow".
  - Do not create, update, delete, or modify any flow node.
  - Answer using only the execution evidence from context.execution.
- Questions such as:
  - "Kenapa node X gagal?"
  - "Mengapa node X gagal?"
  - "Apa penyebab node X gagal?"
  - "Why did node X fail?"
  are execution analysis requests, not selected-node analysis requests.
- A failed node may be identified by context.execution.nodeResults.
- For analyzeExecution, the failure evidence is authoritative.
- Never replace the failed node with another node.
- Never use node indexes to identify the failed node.
- Never invent a node ID.
- Never invent an element type.
- Never invent a locator.
- Never invent a locator strategy.
- Never invent a timeout.
- Never create a modificationPlan.
- modificationPlan MUST always be null for analyzeExecution.
- flowPlan MUST always be null for analyzeExecution.
- The response message must describe only facts supported by context.execution.
- If the failed node locator is available, quote that exact locator.
- If the root cause cannot be determined from the evidence, explicitly state that it cannot be determined.
- The node's flow configuration may be used only as supporting context for explaining the execution failure.

Supported actions:
tap
input
swipe
scroll
delay
wait
assert
setVariable
launchApp
closeApp
back
home
screenshot
if
getText
elementExists
getAttribute
getCurrentActivity
getCurrentPackage
getOrientation
getPlatformVersion
getDeviceName
getDeviceTime
getDisplayed
getEnabled
getSelected
getLocation
getSize
getRect
longPress
doubleTap
drag
pinch
zoom
fling
hideKeyboard
pressReturn



For locator actions use locatorStrategy and locator.

For assert use actual, operator, expected.

Assertion operator rules:
- The operator describes the exact comparison requested by the user.
- Supported operators include:
  equals
  notEquals
  contains
  notContains
  startsWith
  endsWith
  greaterThan
  greaterThanOrEqual
  lessThan
  lessThanOrEqual
  isTrue
  isFalse
  isEmpty
  isNotEmpty
  matches
- If the user explicitly says "contains", use "contains".
- If the user explicitly says "not contains", use "notContains".
- If the user explicitly says "equals", use "equals".
- Never substitute "equals" for another explicitly requested operator.Assert does not use locator.

EXECUTION ANALYSIS OUTPUT:

When the requested intent is "analyzeExecution":

- Return exactly this structure:
{
  "message": string,
  "intent": "analyzeExecution",
  "flowPlan": null,
  "modificationPlan": null
}

- The message must be a concise explanation of the actual execution failure.
- Use only evidence from context.execution.
- You may use the matching node from context.flow only to identify its title, action, locatorStrategy, and locator.
- Never invent or change the failed node ID.
- Never invent a node index.
- Never invent an element type.
- Never invent a locator.
- Never invent a locator strategy.
- Never invent a timeout.
- Never suggest adding, deleting, updating, replacing, or moving a node.
- Never return a modificationPlan.
- Never return a flowPlan.
- If the evidence does not establish the root cause, say that the exact root cause cannot be determined from the available execution evidence.
- For a locator failure, explain that the configured locator could not locate the element. Do not assume the locator is wrong unless the evidence proves it.

When the user asks to analyze the current flow:
intent must be analyzeFlow.
flowPlan must be null.

When the user asks about the selected node:
intent must be analyzeSelectedNode.
flowPlan must be null.

When the user asks to create a NEW flow:

- intent MUST be "generateFlow".
- flowPlan MUST NOT be null.
- modificationPlan MUST be null.
- Generate the requested flow as a flow plan.
- flowPlan MUST contain "type", "summary", "steps", and "warnings".
- flowPlan.type MUST be "flow_plan".
- flowPlan.steps MUST be an array.
- Each item in flowPlan.steps MUST represent one requested flow action.
- flowPlan.warnings MUST be an array of strings.

For generateFlow, return exactly:

{
  "message": string,
  "intent": "generateFlow",
  "flowPlan": {
    "type": "flow_plan",
    "summary": string,
    "steps": [
      {
        "id": string,
        "action": string,
        "title": string,
        "description": string,
        "locatorStrategy": string | null,
        "locator": string | null,
        "text": string | null,
        "duration": number | null,
        "actual": string | null,
        "operator": string | null,
        "expected": string | null,
        "variableName": string | null,
        "timeout": number | null,
        "pollingInterval": number | null
      }
    ],
    "warnings": string[]
  },
  "modificationPlan": null
}

IMPORTANT FOR generateFlow:

- Never return "flowPlan": null.
- Never omit "flowPlan".
- Never put generated steps directly at the top level.
- Never put generated steps inside "modificationPlan".
- flowPlan.steps MUST contain the actual requested actions.
- Use the supported actions listed above.
- For actions that do not require a field, use null.
- Do not invent unrelated actions.
- Preserve the order requested by the user.

Example generateFlow response:

{
  "message": "Saya sudah menyiapkan flow login.",
  "intent": "generateFlow",
  "flowPlan": {
    "type": "flow_plan",
    "summary": "Login to the application.",
    "steps": [
      {
        "id": "ai-launch-app",
        "action": "launchApp",
        "title": "Launch App",
        "description": "Launch the application.",
        "locatorStrategy": null,
        "locator": null,
        "text": null,
        "duration": null,
        "actual": null,
        "operator": null,
        "expected": null,
        "variableName": null,
        "timeout": null,
        "pollingInterval": null
      },
      {
        "id": "ai-input-username",
        "action": "input",
        "title": "Input Username",
        "description": "Enter the username.",
        "locatorStrategy": "accessibilityId",
        "locator": "username",
        "text": "naufal",
        "duration": null,
        "actual": null,
        "operator": null,
        "expected": null,
        "variableName": null,
        "timeout": null,
        "pollingInterval": null
      }
    ],
    "warnings": []
  },
  "modificationPlan": null
}

When the user asks to MODIFY the EXISTING flow:

- intent MUST be "modifyFlow".
- flowPlan MUST be null.
- modificationPlan MUST NOT be null.
- Use the provided current flow context.
- Use an actual node ID from the provided context.
- Do not invent node IDs.
- Modify only what the user requested.
- Do not recreate the entire flow.
- Preserve the semantics of existing nodes and edges.
- Never copy unrelated properties from existing nodes into the new modification step.

For modifyFlow, return exactly:

{
  "message": string,
  "intent": "modifyFlow",
  "flowPlan": null,
  "modificationPlan": {
    "type": "addNodeAfter" | "addNodeBefore" | "updateNode" | "deleteNode",
    "targetNodeId": string,
    "step": {
      "action": string,
      "title": string,
      "description": string,
      "locatorStrategy": string | null,
      "locator": string | null,
      "text": string | null,
      "duration": number | null,
      "actual": string | null,
      "operator": string | null,
      "expected": string | null,
      "variableName": string | null,
      "timeout": number | null,
      "pollingInterval": number | null
    }
  }
}

IMPORTANT:
- For "deleteNode", do NOT include "step".
- For "addNodeAfter", insert the new node after targetNodeId.
- For "addNodeBefore", insert the new node before targetNodeId.
- For "updateNode", modify only the requested fields of targetNodeId.
- For "addNodeBefore" and "addNodeAfter", step describes ONLY the new node being inserted.
- Never copy assertion fields from another node into a wait, tap, input, or other action.
- Never copy timeout, duration, actual, expected, operator, variableName, or text unless that field is required or explicitly requested for the new action.
- Never infer modification fields from unrelated nodes in the current flow.

ACTION-SPECIFIC FIELD RULES:

For "tap":
- Use locatorStrategy and locator.
- Do not use text, duration, actual, operator, expected, timeout, or pollingInterval unless explicitly required.

For "input":
- Use locatorStrategy, locator, and text.
- Do not use duration, actual, operator, expected, timeout, or pollingInterval unless explicitly required.

For "wait":
- Use locatorStrategy and locator when the request refers to waiting for an element.
- Use timeout for the requested wait timeout.
- Use pollingInterval only when explicitly requested or when the existing wait configuration requires it.
- Do NOT use duration for wait.
- Do NOT use actual, operator, or expected for wait.
- Do NOT copy assertion values from surrounding or selected nodes.
- Example: "Tambahkan wait 1000ms" means timeout MUST be 1000.
- Example:
  {
    "action": "wait",
    "locatorStrategy": "xpath",
    "locator": "...",
    "timeout": 1000
  }

For "delay":
- Use duration for the requested delay in milliseconds.
- Do not use locatorStrategy, locator, actual, operator, expected, timeout, or pollingInterval unless explicitly required.

For "assert":
- Use actual, operator, and expected.
- Do NOT use locatorStrategy or locator.
- Do not copy unrelated timeout, duration, or pollingInterval values.

For "if":
- Use actual, operator, and expected.
- Do NOT use locatorStrategy or locator unless explicitly required by the flow implementation.

For "getText", "elementExists", "getAttribute", "getDisplayed", "getEnabled", "getSelected", "getLocation", "getSize", and "getRect":
- Use locatorStrategy and locator.
- Use variableName when the action produces a value.
- Do not copy assertion fields.

For "setVariable":
- Use variableName and text/value.
- Do not copy locator or assertion fields.

For "longPress":
- Use locatorStrategy and locator.
- Use duration only when requested.

For "drag", "pinch", and "zoom":
- Use only the fields relevant to the requested action.
- Do not copy assertion fields.

For "updateNode":
- Return only fields explicitly requested to change.
- Preserve all unspecified fields from the existing node.
- Do not replace existing fields with values copied from another node.

For "deleteNode":
- Return only:
  {
    "type": "deleteNode",
    "targetNodeId": string
  }

For requests referring to "the selected node":
- targetNodeId MUST be the selectedNodeId from the provided context.

For requests involving a specific existing node:
- targetNodeId MUST be the ID of that existing node from the provided context.
- Never invent or modify a node ID.
- When the user says "node yang dipilih", "selected node", or equivalent, use selectedNodeId from the provided context.

MODIFYFLOW OUTPUT RULES:

- If intent is "modifyFlow", flowPlan MUST be null.
- If intent is "modifyFlow", modificationPlan MUST NOT be null.
- Do NOT put modification steps inside flowPlan.
- Do NOT return a generateFlow-style "steps" array for modifyFlow.
- Do NOT recreate the existing flow.
- Preserve the semantics of existing nodes and edges.

A modifyFlow request may contain ONE or MULTIPLE requested modifications.

MULTI-MODIFICATION REQUIREMENT:

- You MUST detect every distinct modification requested by the user.
- A sentence containing multiple actions is a MULTI-MODIFICATION request.
- Do NOT stop after generating the first modification.
- Do NOT ignore later modifications in the same user message.
- If the user uses words such as:
  "lalu"
  "kemudian"
  "dan"
  "setelah itu"
  "then"
  "and then"
  "after that"
  "also"
  to request another change, treat it as a separate modification.
- Each requested change MUST become a separate item in modificationPlan.operations.
- The number of operations MUST match the number of distinct requested modifications.

Example:

User:
"Tambahkan wait 1000ms sebelum node yang dipilih, lalu ubah assertion setelahnya menjadi contains Dashboard"

This contains TWO modifications:

1. Add a wait node before the selected node.
2. Update the assertion node after the selected node so its operator is "contains" and its expected value is "Dashboard".

Therefore the response MUST use:

"modificationPlan": {
  "type": "modification_plan",
  "summary": "Add a wait and update the assertion.",
  "operations": [
    {
      "type": "addNodeBefore",
      "targetNodeId": "<selectedNodeId>",
      "step": {
        "action": "wait",
        "title": "Wait Until Element",
        "description": "Wait until an element is visible",
        "locatorStrategy": "<valid strategy>",
        "locator": "<valid locator>",
        "timeout": 1000
      }
    },
    {
      "type": "updateNode",
      "targetNodeId": "<assertionNodeId>",
      "step": {
        "action": "assert",
        "title": "Assert",
        "description": "Verify value",
        "locatorStrategy": null,
        "locator": null,
        "actual": "<existing assertion actual value>",
        "operator": "contains",
        "expected": "Dashboard"
      }
    }
  ]
}

IMPORTANT:
- The example above is a mandatory structural example.
- Do not return only the first operation.
- Do not collapse multiple operations into one.
- Do not put multiple operations into one step.
- For an updateNode operation, targetNodeId MUST be the actual assertion node ID from the current flow context.
- Preserve the existing assertion's actual value unless the user explicitly asks to change it.
- Change only the assertion fields explicitly requested by the user.
- If the user says "ubah assertion menjadi contains Dashboard", operator MUST be "contains" and expected MUST be "Dashboard".

STEP FIELD NAME RULE:

- Always use "description" for the step description.
- Never use "subtitle".
- Never return both "description" and "subtitle".
- The canonical field is:
  "description": string

For "addNodeAfter":
- targetNodeId is the existing node after which the new node must be inserted.
- step describes ONLY the new node.
- Do not copy fields from the target node unless explicitly requested.

For "addNodeBefore":
- targetNodeId is the existing node before which the new node must be inserted.
- step describes ONLY the new node.
- Do not copy fields from the target node unless explicitly requested.
- This operation is valid even when the target node is the root node.

For "updateNode":
- targetNodeId identifies the existing node being modified.
- step.action MUST match the existing node action.
- Return only fields that the user explicitly asks to change.
- Preserve unspecified fields of the existing node.
- Do not copy unrelated fields from the existing node into the response.

For "deleteNode":
- Do NOT include step.
- Return only:
  {
    "type": "deleteNode",
    "targetNodeId": string
  }

FIELD MINIMIZATION RULE:

For every modification:
- Include only fields relevant to the requested action.
- Do not populate optional fields with values copied from another node.
- Do not reuse values merely because they appear in the current flow context.
- If a field is not needed and the user did not request it, use null or omit it according to the schema.
- Never copy assertion fields into non-assert actions.
- Never copy wait fields into non-wait actions.
- Never copy input fields into non-input actions.

WAIT RULE:
- "wait 1000ms" means timeout = 1000.
- Do NOT interpret wait milliseconds as duration.
- Do NOT use duration for wait.
- Do NOT copy actual, operator, or expected into wait.
- Do NOT copy timeout or pollingInterval from another node.
- Only use pollingInterval when explicitly requested or required by the requested wait behavior.

DELAY RULE:
- "delay 1000ms" means duration = 1000.
- Do NOT use timeout for delay.

ASSERT RULE:
- Assert uses actual, operator, and expected.
- Do NOT use locatorStrategy or locator for assert unless explicitly required by the implementation.
- Preserve the exact assertion operator requested by the user.

MODIFICATION ORDER RULE:

When multiple modifications are requested:
- Execute them in the same order as the user's request.
- The first requested modification must be operations[0].
- The second requested modification must be operations[1].
- Continue in the same order.
- Do not reorder operations based on node position in the flow.

Return ONLY valid JSON.

The top-level JSON must contain:
message
intent
flowPlan
modificationPlan

For modifyFlow:
- intent MUST be "modifyFlow".
- flowPlan MUST be null.
- modificationPlan MUST NOT be null.
- modificationPlan MUST be the ONLY container for modification operations.
- NEVER return "operations" outside modificationPlan.
- NEVER return a top-level "operations" property.
- If exactly one modification is requested, modificationPlan MUST contain "operation".
- If multiple modifications are requested, modificationPlan MUST contain "operations".

For modifyFlow:
- If one modification is requested, use modificationPlan.operation.
- If multiple modifications are requested, use modificationPlan.operations.
- Do NOT put modification operations inside flowPlan.
- Do NOT recreate the existing flow.
- Preserve the semantics of existing nodes and edges.

For generateFlow:
- intent MUST be "generateFlow".
- flowPlan MUST NOT be null.
- modificationPlan MUST be null.

For analyzeFlow:
- intent MUST be "analyzeFlow".
- flowPlan MUST be null.
- modificationPlan MUST be null.

For analyzeSelectedNode:
- intent MUST be "analyzeSelectedNode".
- flowPlan MUST be null.
- modificationPlan MUST be null.
`;

    const response =
        await fetch(
            `${baseUrl}/api/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    model,

                    stream: false,

                    messages: [
                        {
                            role: "system",

                            content:
                                systemPrompt,
                        },

                        {
    role: "user",

    content:
    JSON.stringify({
        message:
            effectiveMessage,

        intent,

        context,
    }),
},
                    ],

                    format: "json",

                    options: {
                        temperature: 0,

                        num_ctx: 8192,
                    },
                }),
            },
        );

    if (!response.ok) {
        const errorText =
            await response.text();

        throw new Error(
            `Ollama request failed (${response.status}): ${errorText}`,
        );
    }

    const data =
        await response.json();

    const content =
        data?.message?.content;

        console.error(
    "[AI DEBUG REQUEST]",
    JSON.stringify(
        {
            effectiveMessage,
        },
        null,
        2,
    ),
);

console.error(
    "[AI RAW RESPONSE]",
    content,
);

    if (
        typeof content !==
        "string"
    ) {
        throw new Error(
            "Ollama returned an invalid message.",
        );
    }

    let parsed;

    try {
        parsed =
            JSON.parse(
                content,
            );
    } catch {
        throw new Error(
            `Ollama returned invalid JSON: ${content}`,
        );
    }

    if (
        !parsed ||
        typeof parsed !==
            "object"
    ) {
        throw new Error(
            "AI response must be a JSON object.",
        );
    }

    if (
        typeof parsed.message !==
        "string"
    ) {
        throw new Error(
            "AI response is missing message.",
        );
    }

    if (
    intent ===
    "analyzeExecution"
) {
    parsed.flowPlan = null;
    parsed.modificationPlan = null;
}
console.error(
    "[AI SANITIZED RESPONSE]",
    JSON.stringify(
        parsed,
        null,
        2,
    ),
);
    const userLanguage =
    /[^\x00-\x7F]/.test(
        message,
    ) ||
    /\b(saya|flow|jelaskan|apa|yang|ini|tolong|buat|tambahkan)\b/i.test(
        message,
    )
        ? "id"
        : "en";
    
    if (
        !VALID_INTENTS.has(
            intent,
        )
    ) {
        throw new Error(
            `Unable to normalize AI intent: ${String(
                parsed.intent,
            )}`,
        );
    }

    if (
    intent ===
    "analyzeFlow"
) {
    const analysisMessage =
        buildFlowAnalysisMessage(
            context,
            userLanguage,
        );

    return {
        message:
            analysisMessage,

        intent:
            "analyzeFlow",

        flowPlan:
            null,
    };
}

if (
    intent ===
    "analyzeSelectedNode"
) {
    const analysisMessage =
        buildSelectedNodeAnalysisMessage(
            context,
            userLanguage,
        );

    return {
        message:
            analysisMessage,

        intent:
            "analyzeSelectedNode",

        flowPlan:
            null,
    };
}

if (
    intent ===
    "analyzeExecution"
) {
    const userLanguage =
        /[^\x00-\x7F]/.test(
            message,
        ) ||
        /\b(saya|flow|jelaskan|apa|yang|ini|tolong|buat|tambahkan)\b/i.test(
            message,
        )
            ? "id"
            : "en";

    const executionMessage =
        buildExecutionAnalysisMessage(
            context,
            userLanguage,
        );

    return {
        message:
            executionMessage ||
            (
                userLanguage ===
                "en"
                    ? "There is not enough execution evidence to analyze the failure."
                    : "Belum ada evidence execution yang cukup untuk menganalisis kegagalan."
            ),

        intent:
            "analyzeExecution",

        flowPlan:
            null,

        modificationPlan:
            null,
    };
}

if (
    intent ===
    "reviewFlow"
) {
    const analysis =
        analyzeFlowQuality(
            context,
        );

    const recommendations =
        buildQARecommendations(
            analysis,
        );

    const reviewMessage =
        buildQAReviewMessage(
            analysis,
            userLanguage,
        );

    return {
        message:
            reviewMessage,

        intent:
            "reviewFlow",

        flowPlan:
            null,

        modificationPlan:
            null,

        qaRecommendations:
            recommendations,
    };
}

if (
    intent ===
    "modifyFlow"
) {
    const rawModificationPlan =
        parsed.modificationPlan ??
        parsed.flowPlan ??
        null;

        /*
     * --------------------------------------------------
     * Apply deterministic clarification target
     * --------------------------------------------------
     *
     * The AI may choose a different target when
     * regenerating the modification plan.
     *
     * When clarificationTargetNodeId exists,
     * the user's explicit selection is authoritative.
     * --------------------------------------------------
     */

    if (
        clarificationTargetNodeId &&
        rawModificationPlan &&
        typeof rawModificationPlan ===
            "object"
    ) {
        if (
            Array.isArray(
                rawModificationPlan.operations,
            )
        ) {
            rawModificationPlan.operations =
                rawModificationPlan.operations.map(
                    (
                        operation,
                        index,
                    ) =>
                        index === 0
                            ? {
                                ...operation,

                                targetNodeId:
                                    clarificationTargetNodeId,
                            }
                            : operation,
                );
        } else {
            rawModificationPlan.targetNodeId =
                clarificationTargetNodeId;

            if (
                rawModificationPlan.operation &&
                typeof rawModificationPlan.operation ===
                    "object"
            ) {
                rawModificationPlan.operation = {
                    ...rawModificationPlan.operation,

                    targetNodeId:
                        clarificationTargetNodeId,
                };
            }
        }
    }

    /*
     * --------------------------------------------------
     * Log raw AI modification plan
     * --------------------------------------------------
     */
    

    /*
     * --------------------------------------------------
     * Ambiguity detection
     *
     * Do not interfere with explicit selected-node
     * references because those already have a
     * deterministic target.
     * --------------------------------------------------
     */
    const ambiguousTargets =
        !/node yang dipilih|selected node|node terpilih/i.test(
            message,
        )
            ? findAmbiguousModificationTargets({
                context,
                message,
            })
            : [];

    /*
     * --------------------------------------------------
     * Ambiguous target
     *
     * Stop here and ask the user to clarify.
     * No modification plan is generated/applied yet.
     * --------------------------------------------------
     */
    if (
        ambiguousTargets.length >
        1
    ) {
        const candidateLines =
            ambiguousTargets
                .map(
                    (
                        candidate,
                        index,
                    ) =>
                        `${index + 1}. ${
                            candidate.title ??
                            candidate.action ??
                            "Node"
                        }`,
                )
                .join(
                    "\n",
                );

        return {
            message:
                `Saya menemukan ${ambiguousTargets.length} node yang cocok dengan permintaan Anda.\n\n${candidateLines}\n\nSilakan tentukan node yang dimaksud, misalnya "yang pertama" atau "yang kedua".`,

            intent:
                "modifyFlow",

            flowPlan:
                null,

            modificationPlan:
                null,

            clarification: {
                type:
                    "target_node",

                question:
                    "Node mana yang Anda maksud?",

                candidates:
                    ambiguousTargets,
            },
        };
    }

    /*
     * --------------------------------------------------
     * Normalize modification plan
     * --------------------------------------------------
     */
    const modificationPlan =
    normalizeModificationPlan(
        rawModificationPlan,
        context,
        effectiveMessage,
    );

    /*
     * --------------------------------------------------
     * Invalid modification plan
     * --------------------------------------------------
     *
     * At this point ambiguity has already been checked.
     * Therefore null here means the plan itself is invalid.
     * --------------------------------------------------
     */
    if (!modificationPlan) {
        throw new Error(
            "AI modifyFlow response does not contain a valid modification plan.",
        );
    }

    /*
     * --------------------------------------------------
     * Return modification plan
     * --------------------------------------------------
     */
    return {
        message:
            typeof parsed.message ===
            "string"
                ? parsed.message
                : "Saya sudah menyiapkan perubahan untuk flow.",

        intent:
            "modifyFlow",

        flowPlan:
            null,

        modificationPlan,
    };
}

let flowPlan = null;

if (
    intent ===
    "generateFlow"
) {
    const normalizedPlan =
        normalizeModelFlowPlan(
            parsed.flowPlan,
            message,
        );

    flowPlan =
        validateNormalizedPlan(
            normalizedPlan,
        );

    if (!flowPlan) {
    throw new Error(
        `AI generateFlow response does not contain a valid flow plan. parsed.flowPlan=${JSON.stringify(
            parsed.flowPlan,
            null,
            2,
        )}`,
    );
}
}

    const finalResponse = {
    message:
        buildAssistantMessage(
            parsed.message,
            intent,
            flowPlan,
        ),

    intent,

    flowPlan,
};

function buildAssistantMessage(
    parsedMessage,
    intent,
    flowPlan,
) {
    if (
        intent === "generateFlow" &&
        flowPlan
    ) {
        return `Saya sudah menyiapkan flow dengan ${flowPlan.steps.length} langkah. Silakan review plan di bawah sebelum menerapkannya ke flow.`;
    }

    if (
        typeof parsedMessage ===
        "string"
    ) {
        return parsedMessage;
    }

    return "Saya siap membantu flow kamu.";
}

return finalResponse;
}