import { useGeneratorStore } from "../store/useGeneratorStore";

export function useCopyCode() {
    const project = useGeneratorStore(
        (state) => state.project,
    );

    const activeFile = useGeneratorStore(
        (state) => state.activeFile,
    );

    return async (): Promise<boolean> => {
        if (!project || !activeFile) {
            return false;
        }

        const file = project.files.find(
            (item) =>
                item.path === activeFile,
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