import Editor from "@monaco-editor/react";

import { useGeneratorStore } from "../store/useGeneratorStore";

export function CodePreview() {

    const code =
        useGeneratorStore(
            (state) => state.code,
        );

    return (
        <Editor
            language="python"
            theme="vs-dark"
            value={code}
            options={{
                readOnly: true,

                minimap: {
                    enabled: false,
                },

                fontSize: 14,

                wordWrap: "on",

                scrollBeyondLastLine: false,
            }}
        />
    );
}