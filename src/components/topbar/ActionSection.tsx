import { ToolbarGroup } from "../ui/ToolbarGroup";

import { OpenButton } from "./OpenButton";
import { SaveButton } from "./SaveButton";
import { RunButton } from "./RunButton";

export function ActionSection() {
  return (
    <ToolbarGroup>
      <OpenButton />

      <SaveButton />

      <RunButton />
    </ToolbarGroup>
  );
}