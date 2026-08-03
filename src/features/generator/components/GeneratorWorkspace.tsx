import { GeneratorHeader } from "./GeneratorHeader";
import { ExplorerHeader } from "./ExplorerHeader";
import { PreviewHeader } from "./PreviewHeader";
import { GeneratorExplorer } from "./GeneratorExplorer";
import { CodePreview } from "./CodePreview";

import { useGeneratorStore } from "../store/useGeneratorStore";

import { generatorService } from "../services/GeneratorService";

import { useCopyCode } from "../hooks/useCopyCode";
import { useDownloadCode } from "../hooks/useDownloadCode";
import { GeneratorStatusBar } from "./GeneratorStatusBar";

export function GeneratorWorkspace() {
    const project = useGeneratorStore(
        (state) => state.project,
    );

    const copy = useCopyCode();
    const download = useDownloadCode();

    return (
        <div className="flex h-full w-full min-h-0 flex-col">

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
                    flex-1
                    min-h-0
                    grid-rows-[240px_1fr]
                "
            >
                {/* Explorer */}

                <section className="flex min-h-0 flex-col border-b border-neutral-800">

                    <ExplorerHeader />

                    <div className="flex-1 overflow-y-auto">
                        <GeneratorExplorer />
                    </div>

                </section>

                {/* Preview */}

                <section className="flex min-h-0 flex-col">

                    <PreviewHeader />

                    <div className="flex-1 min-h-0 overflow-hidden">
                        <CodePreview />
                    </div>

                </section>

            </div>

        </div>
    );
}