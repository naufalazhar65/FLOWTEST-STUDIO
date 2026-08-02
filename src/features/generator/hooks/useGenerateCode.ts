import type { FlowNode } from "../../flow/types/flowNode";

import { generatePython } from "../engine/generatePython";
import { useGeneratorStore } from "../store/useGeneratorStore";

export function useGenerateCode() {
    const setCode = useGeneratorStore(
        (state) => state.setCode,
    );

    return (nodes: FlowNode[]) => {
        const code = generatePython(nodes);

        setCode(code);

        return code;
    };
}