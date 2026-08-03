import Editor from "@monaco-editor/react";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { getLanguage } from "../utils/getLanguage";

import { PreviewTabs } from "./PreviewTabs";
import { PreviewBreadcrumb } from "./PreviewBreadcrumb";
import { EditorStatusBar } from "./EditorStatusBar";

export function CodePreview() {
    const project = useGeneratorStore(
        (state) => state.project,
    );

    const activeFile = useGeneratorStore(
        (state) => state.activeFile,
    );

    const openFiles = useGeneratorStore(
        (state) => state.openFiles,
    );

    const closeFile = useGeneratorStore(
        (state) => state.closeFile,
    );

    const setActiveFile = useGeneratorStore(
        (state) => state.setActiveFile,
    );

    const file = project?.files.find(
        (file) => file.path === activeFile,
    );

    if (!file) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                Select a file to preview
            </div>
        );
    }

    const language = getLanguage(file.path);

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">

            <PreviewTabs
                openFiles={openFiles}
                activeFile={activeFile}
                onSelect={setActiveFile}
                onClose={closeFile}
            />

            <PreviewBreadcrumb
                path={file.path}
            />

            <div className="min-h-0 flex-1 overflow-hidden">
                <Editor
                    path={file.path}
                    language={language}
                    theme="vs-dark"
                    value={file.content}
                    height="100%"
                    width="100%"
                    loading={
                        <div className="flex h-full items-center justify-center text-neutral-500">
                            Loading editor...
                        </div>
                    }
                    options={{
                        readOnly: true,
                        automaticLayout: true,

                        minimap: {
                            enabled: false,
                        },

                        fontSize: 13,

                        fontFamily:
                            "JetBrains Mono, Consolas, monospace",

                        lineNumbers: "on",

                        wordWrap: "on",

                        scrollBeyondLastLine: false,

                        smoothScrolling: true,

                        renderWhitespace: "selection",

                        folding: true,

                        glyphMargin: false,

                        contextmenu: true,

                        padding: {
                            top: 16,
                        },
                    }}
                />
            </div>

            <EditorStatusBar
                language={language}
            />

        </div>
    );
}