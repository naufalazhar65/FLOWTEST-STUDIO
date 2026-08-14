import Editor from "@monaco-editor/react";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { getLanguage } from "../utils/getLanguage";

import { PreviewTabs } from "./PreviewTabs";
import { PreviewBreadcrumb } from "./PreviewBreadcrumb";
import { EditorStatusBar } from "./EditorStatusBar";

export function CodePreview() {
    const project =
        useGeneratorStore(
            (state) => state.project,
        );

    const activeFile =
        useGeneratorStore(
            (state) => state.activeFile,
        );

    const openFiles =
        useGeneratorStore(
            (state) => state.openFiles,
        );

    const closeFile =
        useGeneratorStore(
            (state) => state.closeFile,
        );

    const setActiveFile =
        useGeneratorStore(
            (state) => state.setActiveFile,
        );

    const file = project?.files.find(
        (item) =>
            item.path === activeFile,
    );

    if (!file) {
        return (
            <div
                className="
                    flex
                    h-full
                    items-center
                    justify-center
                    bg-neutral-950
                    px-6
                    text-center
                "
            >
                <div>
                    <div className="text-sm text-neutral-400">
                        Select a file to preview
                    </div>

                    <div className="mt-1 text-xs text-neutral-600">
                        Choose a file from the Explorer.
                    </div>
                </div>
            </div>
        );
    }

    const language =
        getLanguage(file.path);

    return (
        <div
            className="
                flex
                h-full
                min-h-0
                flex-col
                overflow-hidden
                bg-neutral-950
            "
        >
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
                        <div
                            className="
                                flex
                                h-full
                                items-center
                                justify-center
                                bg-neutral-950
                                text-xs
                                text-neutral-600
                            "
                        >
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

                        lineNumbersMinChars: 3,

                        wordWrap: "off",

                        scrollBeyondLastLine: false,

                        smoothScrolling: true,

                        cursorBlinking: "smooth",

                        cursorSmoothCaretAnimation:
                            "on",

                        renderWhitespace:
                            "selection",

                        renderLineHighlight:
                            "line",

                        folding: true,

                        glyphMargin: false,

                        contextmenu: true,

                        overviewRulerBorder:
                            false,

                        hideCursorInOverviewRuler:
                            true,

                        padding: {
                            top: 16,
                            bottom: 16,
                        },

                        scrollbar: {
                            horizontalScrollbarSize: 8,
                            verticalScrollbarSize: 8,
                        },

                        bracketPairColorization: {
                            enabled: true,
                        },

                        stickyScroll: {
                            enabled: true,
                        },

                        guides: {
                            indentation: true,
                            bracketPairs: true,
                        },

                        suggest: {
                            showMethods: false,
                            showFunctions: false,
                            showConstructors: false,
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