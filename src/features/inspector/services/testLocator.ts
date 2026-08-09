import { elementService } from "../../execution/services/appium/ElementService";

import type { LocatorStrategy as ExecutionLocatorStrategy } from "../../execution/types/LocatorStrategy";

import type { LocatorCandidate } from "../types/LocatorCandidate";

interface TestLocatorResult {
    found: boolean;
    elementId?: string;
    error?: string;
}

function toExecutionStrategy(
    strategy: LocatorCandidate["strategy"],
): ExecutionLocatorStrategy {
    switch (strategy) {
        case "accessibilityId":
            return "accessibilityId";

        case "id":
            return "id";

        case "xpath":
            return "xpath";

        case "className":
            return "className";

        case "androidUiAutomator":
            return "androidUiAutomator";

        case "iosPredicate":
            return "iOSPredicateString";

        default:
            throw new Error(
                `Unsupported locator strategy: ${strategy}`,
            );
    }
}

export async function testLocator(
    locator: LocatorCandidate,
): Promise<TestLocatorResult> {
    try {
        const strategy =
            toExecutionStrategy(
                locator.strategy,
            );

        const elementId =
            await elementService.findElement(
                strategy,
                locator.value,
            );

        return {
            found: true,
            elementId,
        };
    } catch (error) {
        return {
            found: false,
            error:
                error instanceof Error
                    ? error.message
                    : String(error),
        };
    }
}