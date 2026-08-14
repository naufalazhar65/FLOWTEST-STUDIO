import { GeneratorHeader } from "./GeneratorHeader";
import { ExplorerHeader } from "./ExplorerHeader";
import { PreviewHeader } from "./PreviewHeader";
import { GeneratorExplorer } from "./GeneratorExplorer";
import { CodePreview } from "./CodePreview";
import { GeneratorStatusBar } from "./GeneratorStatusBar";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { generatorService } from "../services/GeneratorService";

import { useCopyCode } from "../hooks/useCopyCode";
import { useDownloadCode } from "../hooks/useDownloadCode";

export function GeneratorWorkspace() {
    const project = useGeneratorStore(
        (state) => state.project,
    );

    const copy = useCopyCode();
    const download = useDownloadCode();

    return (
        <div
            className="
                flex
                h-full
                min-h-0
                w-full
                min-w-0
                flex-col
                overflow-hidden
                bg-neutral-950
            "
        >
            <GeneratorHeader
                hasProject={!!project}
                onGenerate={() =>
                    generatorService.generate()
                }
                onCopy={copy}
                onDownload={download}
            />

            <GeneratorStatusBar
                framework={project?.framework}
                fileCount={
                    project?.files.length ?? 0
                }
                ready={!!project}
            />

            <div
                className="
                    grid
                    min-h-0
                    min-w-0
                    flex-1
                    grid-cols-1
                    grid-rows-[minmax(180px,32%)_minmax(0,1fr)]
                    overflow-hidden
                "
            >
                <section
                    className="
                        flex
                        min-h-0
                        min-w-0
                        flex-col
                        overflow-hidden
                        border-b
                        border-neutral-800
                    "
                >
                    <ExplorerHeader />

                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-hidden
                        "
                    >
                        <GeneratorExplorer />
                    </div>
                </section>

                <section
                    className="
                        flex
                        min-h-0
                        min-w-0
                        flex-col
                        overflow-hidden
                    "
                >
                    <PreviewHeader />

                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-hidden
                        "
                    >
                        <CodePreview />
                    </div>
                </section>
            </div>
        </div>
    );
}