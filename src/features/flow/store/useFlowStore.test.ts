import { beforeEach, describe, expect, it } from "vitest";

import {
    initialNodes,
    initialEdges,
} from "../data/initialFlow";

import { useFlowStore } from "./useFlowStore";

describe("useFlowStore history", () => {
    beforeEach(() => {
        useFlowStore.getState().resetFlow();
    });

    it("should undo an addNode operation", () => {
        const store = useFlowStore.getState();

        const initialNodeCount =
            store.nodes.length;

        store.addNode("tap");

        expect(
            useFlowStore.getState().nodes,
        ).toHaveLength(
            initialNodeCount + 1,
        );

        useFlowStore.getState().undo();

        expect(
            useFlowStore.getState().nodes,
        ).toEqual(initialNodes);

        expect(
            useFlowStore.getState().edges,
        ).toEqual(initialEdges);
    });

    it("should redo an undone addNode operation", () => {
        const store = useFlowStore.getState();

        store.addNode("tap");

        const stateAfterAdd =
            useFlowStore.getState();

        const nodesAfterAdd =
            structuredClone(
                stateAfterAdd.nodes,
            );

        const edgesAfterAdd =
            structuredClone(
                stateAfterAdd.edges,
            );

        stateAfterAdd.undo();

        useFlowStore.getState().redo();

        expect(
            useFlowStore.getState().nodes,
        ).toEqual(nodesAfterAdd);

        expect(
            useFlowStore.getState().edges,
        ).toEqual(edgesAfterAdd);
    });

    it("should clear future after a new change", () => {
        const store = useFlowStore.getState();

        store.addNode("tap");

        useFlowStore.getState().undo();

        expect(
            useFlowStore.getState().future,
        ).toHaveLength(1);

        useFlowStore
            .getState()
            .addNode("input");

        expect(
            useFlowStore.getState().future,
        ).toHaveLength(0);
    });

    it("should restore edges when undoing connectNodes", () => {
        const store = useFlowStore.getState();

        const originalEdges =
            structuredClone(
                store.edges,
            );

        store.connectNodes({
            source: "1",
            target: "3",
            sourceHandle: null,
            targetHandle: null,
        });

        expect(
            useFlowStore.getState().edges,
        ).toHaveLength(
            originalEdges.length + 1,
        );

        useFlowStore.getState().undo();

        expect(
            useFlowStore.getState().edges,
        ).toEqual(originalEdges);
    });

    it("should restore connected edge after redo", () => {
        const store = useFlowStore.getState();

        store.connectNodes({
            source: "1",
            target: "3",
            sourceHandle: null,
            targetHandle: null,
        });

        const edgesAfterConnect =
            structuredClone(
                useFlowStore.getState().edges,
            );

        useFlowStore.getState().undo();
        useFlowStore.getState().redo();

        expect(
            useFlowStore.getState().edges,
        ).toEqual(edgesAfterConnect);
    });

    it("should undo and redo multiple changes in order", () => {
        const store = useFlowStore.getState();

        const initialState = {
            nodes: structuredClone(
                store.nodes,
            ),
            edges: structuredClone(
                store.edges,
            ),
        };

        store.addNode("tap");

        const stateAfterFirstAdd = {
            nodes: structuredClone(
                useFlowStore.getState().nodes,
            ),
            edges: structuredClone(
                useFlowStore.getState().edges,
            ),
        };

        store.addNode("input");

        const stateAfterSecondAdd = {
            nodes: structuredClone(
                useFlowStore.getState().nodes,
            ),
            edges: structuredClone(
                useFlowStore.getState().edges,
            ),
        };

        useFlowStore.getState().undo();

        expect(
            useFlowStore.getState().nodes,
        ).toEqual(
            stateAfterFirstAdd.nodes,
        );

        expect(
            useFlowStore.getState().edges,
        ).toEqual(
            stateAfterFirstAdd.edges,
        );

        useFlowStore.getState().undo();

        expect(
            useFlowStore.getState().nodes,
        ).toEqual(
            initialState.nodes,
        );

        expect(
            useFlowStore.getState().edges,
        ).toEqual(
            initialState.edges,
        );

        useFlowStore.getState().redo();

        expect(
            useFlowStore.getState().nodes,
        ).toEqual(
            stateAfterFirstAdd.nodes,
        );

        expect(
            useFlowStore.getState().edges,
        ).toEqual(
            stateAfterFirstAdd.edges,
        );

        useFlowStore.getState().redo();

        expect(
            useFlowStore.getState().nodes,
        ).toEqual(
            stateAfterSecondAdd.nodes,
        );

        expect(
            useFlowStore.getState().edges,
        ).toEqual(
            stateAfterSecondAdd.edges,
        );
    });
});