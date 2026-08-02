import { useGeneratorStore } from "../store/useGeneratorStore";

import { downloadFile } from "../utils/downloadFile";

export function useDownloadCode() {
    const code = useGeneratorStore(
        (state) => state.code,
    );

    return () => {
        if (!code) {
            return false;
        }

        downloadFile(
            "test_generated.py",
            code,
            "text/x-python",
        );

        return true;
    };
}