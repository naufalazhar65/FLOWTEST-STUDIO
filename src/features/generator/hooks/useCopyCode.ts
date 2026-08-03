import { useGeneratorStore } from "../store/useGeneratorStore";

export function useCopyCode() {
    const project = useGeneratorStore(
        (state) => state.project,
    );

    const selectedFile = useGeneratorStore(
        (state) => state.selectedFile,
    );

    return async () => {
        if (!project || !selectedFile) {
            return false;
        }

        const file = project.files.find(
            (file) =>
                file.path === selectedFile,
        );

        if (!file) {
            return false;
        }

        try {
            await navigator.clipboard.writeText(
                file.content,
            );

            return true;
        } catch {
            return false;
        }
    };
}