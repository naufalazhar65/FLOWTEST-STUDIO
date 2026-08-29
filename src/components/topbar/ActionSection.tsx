import { ToolbarGroup } from "../ui/ToolbarGroup";
import { ProjectMenu } from "./ProjectMenu";
import { RunButton } from "./RunButton";
import { useProjectStore } from "../../features/project/store/useProjectStore";
import { RetrySettings } from "../../features/execution/components/RetrySettings";

function VerticalDivider() {
  return <div className="h-[22px] w-px bg-[#30363D] flex-shrink-0" aria-hidden="true" />;
}

export function ActionSection() {
  const name = useProjectStore((state) => state.name);
  const modified = useProjectStore((state) => state.isModified);

  return (
    <div className="flex items-center gap-3 min-w-0">
      {/* Project menu - fleksibel tapi tidak memakan terlalu banyak ruang */}
      <div className="flex-shrink min-w-0 overflow-hidden">
        <ProjectMenu name={name} modified={modified} />
      </div>

      {/* Divider */}
      <VerticalDivider />

      {/* Execution controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ToolbarGroup>
          <RetrySettings />
        </ToolbarGroup>
        <VerticalDivider />
        <ToolbarGroup>
          <RunButton />
        </ToolbarGroup>
      </div>
    </div>
  );
}