import { useGeneratorStore } from "../store/useGeneratorStore";
import { downloadProject } from "../utils/downloadProject";

export function useDownloadCode() {
    return async () => {
        const project =
            useGeneratorStore
                .getState()
                .project;

        if (!project) {
            return;
        }

        await downloadProject(project);
    };
}