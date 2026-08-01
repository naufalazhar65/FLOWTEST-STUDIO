import { ToolbarGroup } from "../ui/ToolbarGroup";

import { PlatformBadge } from "./PlatformBadge";
import { ConnectionBadge } from "./ConnectionBadge";

import { useFlowStore } from "../../features/flow/store/useFlowStore";
import { useExecutionStore } from "../../features/execution/store/useExecutionStore";
import { getFlowPlatform } from "../../features/flow/services/getFlowPlatform";

export function StatusSection() {
    const nodes = useFlowStore(
        (state) => state.nodes,
    );

    const platform = getFlowPlatform(nodes);

    const appiumConnection =
        useExecutionStore(
            (state) => state.appiumConnection,
        );

    return (
        <ToolbarGroup>
            <PlatformBadge
                platform={platform}
            />

            <ConnectionBadge
                status={appiumConnection}
            />

        </ToolbarGroup>
    );
}