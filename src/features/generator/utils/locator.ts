export function locatorStrategy(
    strategy: string,
): string {
    return `AppiumBy.${strategy.toUpperCase()}`;
}