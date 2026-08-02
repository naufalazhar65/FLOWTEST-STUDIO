import type { FlowNode } from "../../flow/types/flowNode";

import { useGeneratorStore } from "../store/useGeneratorStore";

import { useCopyCode } from "../hooks/useCopyCode";
import { useDownloadCode } from "../hooks/useDownloadCode";
import { useGenerateCode } from "../hooks/useGenerateCode";

import { CopyButton } from "./CopyButton";
import { DownloadButton } from "./DownloadButton";
import { GenerateButton } from "./GenerateButton";

interface GeneratorToolbarProps {
    nodes: FlowNode[];
}

export function GeneratorToolbar({
    nodes,
}: GeneratorToolbarProps) {
    const code = useGeneratorStore(
        (state) => state.code,
    );

    const generate = useGenerateCode();

    const copy = useCopyCode();

    const download =
        useDownloadCode();

    return (
        <div className="flex items-center justify-between border-b p-3">
            <h2 className="font-semibold">
                Generated Python
            </h2>

            <div className="flex items-center gap-2">
                <GenerateButton
                    onClick={() =>
                        generate(nodes)
                    }
                />

                <CopyButton
                    disabled={!code}
                    onClick={copy}
                />

                <DownloadButton
                    disabled={!code}
                    onClick={download}
                />
            </div>
        </div>
    );
}