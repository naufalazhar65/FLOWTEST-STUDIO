import type { LocatorStrategy } from "../../../execution/types/LocatorStrategy";

export const LOCATOR_STRATEGIES: readonly LocatorStrategy[] = [
    "id",
    "xpath",
    "accessibilityId",
    "className",
    "androidUiAutomator",
    "iOSPredicateString",
    "iOSClassChain",
];
