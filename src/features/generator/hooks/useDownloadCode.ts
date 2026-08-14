import { useGeneratorStore } from "../store/useGeneratorStore";
import { downloadProject } from "../utils/downloadProject";

export function useDownloadCode() {
    return async (): Promise<boolean> => {
        const project =
            useGeneratorStore
                .getState()
                .project;

        if (!project) {
            return false;
        }

        try {
            await downloadProject(project);

            return true;
        } catch {
            return false;
        }
    };
}