import { Input } from "../../../../components/ui/Input";

import { useFlowStore } from "../../store/useFlowStore";

interface Props {
    nodeId: string;

    fieldKey: string;

    value: string;
}

export function TextField({
    nodeId,
    fieldKey,
    value,
}: Props) {
    const updateNodeData =
        useFlowStore(
            (state) =>
                state.updateNodeData,
        );

    return (
        <Input
            value={value}
            onChange={(event) =>
                updateNodeData(
                    nodeId,
                    {
                        [fieldKey]:
                            event.target
                                .value,
                    },
                )
            }
        />
    );
}