export function pluginTitle(action: string): string {
  switch (action) {
    case "tap":
      return "Tap";

    case "input":
      return "Input";

    case "assert":
      return "Assert";

    default:
      return action;
  }
}