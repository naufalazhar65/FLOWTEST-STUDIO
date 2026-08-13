import { Select } from "../../../../components/ui/Select";

import { useFlowStore } from "../../store/useFlowStore";

interface Props {
    nodeId: string;

    fieldKey: string;

    value: string;

    options: readonly string[];
}

export function SelectField({
    nodeId,
    fieldKey,
    value,
    options,
}: Props) {
    const updateNodeData =
        useFlowStore(
            (state) =>
                state.updateNodeData,
        );

    return (
        <Select
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
        >
            {options.map(
                (option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ),
            )}
        </Select>
    );
}