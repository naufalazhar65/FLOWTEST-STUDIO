import { Logo } from "./Logo";
import { PlatformBadge } from "./PlatformBadge";
import { ConnectionBadge } from "./ConnectionBadge";
import { ExecutionProgress } from "./ExecutionProgress";

import { OpenButton } from "./OpenButton";
import { SaveButton } from "./SaveButton";
import { RunButton } from "./RunButton";

import { ToolbarGroup } from "../ui/ToolbarGroup";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { useExecutionStore } from "../../features/execution/store/useExecutionStore";

import { getFlowPlatform } from "../../features/flow/services/getFlowPlatform";

export function TopBar() {
  const nodes = useFlowStore(
    (state) => state.nodes,
  );

  const platform =
    getFlowPlatform(nodes);

  const appiumConnection =
    useExecutionStore(
      (state) =>
        state.appiumConnection,
    );

  return (
    <header
      style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent:
          "space-between",
        padding: "0 20px",
        background: "#161B22",
        borderBottom:
          "1px solid #30363D",
      }}
    >
      <Logo />

      <ToolbarGroup>
        <PlatformBadge
          platform={platform}
        />

        <ConnectionBadge
          status={
            appiumConnection
          }
        />

        <ExecutionProgress />
      </ToolbarGroup>

      <ToolbarGroup>
        <OpenButton />

        <SaveButton />

        <RunButton />
      </ToolbarGroup>
    </header>
  );
}