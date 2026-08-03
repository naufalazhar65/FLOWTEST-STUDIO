import { generateProject } from "../engine/generateProject";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { useFlowStore } from "../../flow/store/useFlowStore";

export class GeneratorService {
    generate() {
        const {
            nodes,
            edges,
        } = useFlowStore.getState();

        const project =
            generateProject(
                nodes,
                edges,
            );

        useGeneratorStore
            .getState()
            .setProject(project);

        return project;
    }

    clear() {
        useGeneratorStore
            .getState()
            .clear();
    }
}

export const generatorService =
    new GeneratorService();