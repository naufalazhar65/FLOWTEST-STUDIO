import { Input } from "../../../../components/ui/Input";

import { useFlowStore } from "../../store/useFlowStore";

interface Props {
    nodeId: string;

    fieldKey: string;

    value: number;

    min?: number;

    max?: number;

    step?: number;
}

export function NumberField({
    nodeId,
    fieldKey,
    value,
    min,
    max,
    step,
}: Props) {
    const updateNodeData =
        useFlowStore(
            (state) =>
                state.updateNodeData,
        );

    return (
        <Input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(event) => {
                const rawValue =
                    event.target.value;

                /*
                 * Keep the field editable while
                 * the user is typing.
                 */
                if (rawValue === "") {
                    return;
                }

                const numericValue =
                    Number(rawValue);

                if (
                    Number.isNaN(
                        numericValue,
                    )
                ) {
                    return;
                }

                updateNodeData(
                    nodeId,
                    {
                        [fieldKey]:
                            numericValue,
                    },
                );
            }}
        />
    );
}