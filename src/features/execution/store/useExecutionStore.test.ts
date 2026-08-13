import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    useExecutionStore,
} from "./useExecutionStore";

describe("useExecutionStore", () => {
    beforeEach(() => {
        useExecutionStore
            .getState()
            .reset();
    });

    it("has the correct initial state after reset", () => {
        const state =
            useExecutionStore.getState();

        expect(state.status).toBe("idle");
        expect(state.isPaused).toBe(false);
        expect(state.isStopped).toBe(false);
        expect(state.currentNodeId).toBeNull();

        expect(state.nodeStatus).toEqual({});
        expect(state.edgeStatus).toEqual({});
        expect(state.nodeResults).toEqual({});

        expect(state.totalNodes).toBe(0);
        expect(state.executedNodes).toBe(0);
        expect(state.passedNodes).toBe(0);
        expect(state.failedNodes).toBe(0);
        expect(state.progress).toBe(0);

        expect(state.startedAt).toBeNull();
        expect(state.finishedAt).toBeNull();
        expect(state.duration).toBe(0);
    });

    it("starts execution with the correct state", () => {
        const store =
            useExecutionStore.getState();

        store.startExecution(5);

        const state =
            useExecutionStore.getState();

        expect(state.status).toBe("running");
        expect(state.isPaused).toBe(false);
        expect(state.isStopped).toBe(false);

        expect(state.totalNodes).toBe(5);
        expect(state.executedNodes).toBe(0);
        expect(state.passedNodes).toBe(0);
        expect(state.failedNodes).toBe(0);
        expect(state.progress).toBe(0);

        expect(state.startedAt).not.toBeNull();
        expect(state.finishedAt).toBeNull();
        expect(state.duration).toBe(0);

        expect(state.currentNodeId).toBeNull();
        expect(state.nodeStatus).toEqual({});
        expect(state.edgeStatus).toEqual({});
        expect(state.nodeResults).toEqual({});
    });

    it("sets the current node", () => {
        const store =
            useExecutionStore.getState();

        store.setCurrentNode("node-1");

        expect(
            useExecutionStore
                .getState()
                .currentNodeId,
        ).toBe("node-1");

        store.setCurrentNode(null);

        expect(
            useExecutionStore
                .getState()
                .currentNodeId,
        ).toBeNull();
    });

    it("sets node execution status", () => {
        const store =
            useExecutionStore.getState();

        store.setNodeStatus(
            "node-1",
            "running",
        );

        store.setNodeStatus(
            "node-2",
            "passed",
        );

        const state =
            useExecutionStore.getState();

        expect(state.nodeStatus).toEqual({
            "node-1": "running",
            "node-2": "passed",
        });
    });

    it("sets edge execution status", () => {
        const store =
            useExecutionStore.getState();

        store.setEdgeStatus(
            "edge-1",
            "running",
        );

        store.setEdgeStatus(
            "edge-2",
            "passed",
        );

        const state =
            useExecutionStore.getState();

        expect(state.edgeStatus).toEqual({
            "edge-1": "running",
            "edge-2": "passed",
        });
    });

    it("stores node execution result", () => {
        const store =
            useExecutionStore.getState();

        const result = {
            nodeId: "node-1",
            nodeType: "tap",
            nodeTitle: "Tap",
            status: "passed" as const,
            startedAt: 1000,
            finishedAt: 1100,
            duration: 100,
        };

        store.setNodeResult(result);

        const state =
            useExecutionStore.getState();

        expect(
            state.nodeResults["node-1"],
        ).toEqual(result);
    });

    it("stores multiple node execution results", () => {
        const store =
            useExecutionStore.getState();

        const firstResult = {
            nodeId: "node-1",
            nodeType: "tap",
            nodeTitle: "Tap",
            status: "passed" as const,
            startedAt: 1000,
            finishedAt: 1100,
            duration: 100,
        };

        const secondResult = {
            nodeId: "node-2",
            nodeType: "input",
            nodeTitle: "Input",
            status: "failed" as const,
            startedAt: 1200,
            finishedAt: 1400,
            duration: 200,
            error: "Input failed",
        };

        store.setNodeResult(
            firstResult,
        );

        store.setNodeResult(
            secondResult,
        );

        const state =
            useExecutionStore.getState();

        expect(
            state.nodeResults,
        ).toEqual({
            "node-1": firstResult,
            "node-2": secondResult,
        });
    });

    it("replaces an existing node result", () => {
        const store =
            useExecutionStore.getState();

        const firstResult = {
            nodeId: "node-1",
            nodeType: "tap",
            nodeTitle: "Tap",
            status: "failed" as const,
            startedAt: 1000,
            finishedAt: 1200,
            duration: 200,
            error: "First failure",
        };

        const updatedResult = {
            nodeId: "node-1",
            nodeType: "tap",
            nodeTitle: "Tap",
            status: "passed" as const,
            startedAt: 2000,
            finishedAt: 2100,
            duration: 100,
        };

        store.setNodeResult(
            firstResult,
        );

        store.setNodeResult(
            updatedResult,
        );

        expect(
            useExecutionStore
                .getState()
                .nodeResults["node-1"],
        ).toEqual(updatedResult);
    });

    it("completes a passed node", () => {
        const store =
            useExecutionStore.getState();

        store.startExecution(4);

        store.completeNode(true);

        const state =
            useExecutionStore.getState();

        expect(state.executedNodes).toBe(1);
        expect(state.passedNodes).toBe(1);
        expect(state.failedNodes).toBe(0);
        expect(state.progress).toBe(25);
    });

    it("completes a failed node", () => {
        const store =
            useExecutionStore.getState();

        store.startExecution(4);

        store.completeNode(false);

        const state =
            useExecutionStore.getState();

        expect(state.executedNodes).toBe(1);
        expect(state.passedNodes).toBe(0);
        expect(state.failedNodes).toBe(1);
        expect(state.progress).toBe(25);
    });

    it("calculates progress as nodes are completed", () => {
        const store =
            useExecutionStore.getState();

        store.startExecution(4);

        store.completeNode(true);
        store.completeNode(true);

        let state =
            useExecutionStore.getState();

        expect(state.executedNodes).toBe(2);
        expect(state.passedNodes).toBe(2);
        expect(state.failedNodes).toBe(0);
        expect(state.progress).toBe(50);

        store.completeNode(false);

        state =
            useExecutionStore.getState();

        expect(state.executedNodes).toBe(3);
        expect(state.passedNodes).toBe(2);
        expect(state.failedNodes).toBe(1);
        expect(state.progress).toBe(75);
    });

    it("finishes execution", () => {
        const store =
            useExecutionStore.getState();

        store.startExecution(2);

        store.completeNode(true);

        store.finishExecution();

        const state =
            useExecutionStore.getState();

        expect(state.finishedAt).not.toBeNull();
        expect(state.duration).toBeGreaterThanOrEqual(0);
        expect(state.progress).toBe(100);
        expect(state.currentNodeId).toBeNull();
    });

    it("pauses execution", () => {
        const store =
            useExecutionStore.getState();

        store.startExecution(2);

        store.pauseExecution();

        const state =
            useExecutionStore.getState();

        expect(state.isPaused).toBe(true);
        expect(state.status).toBe("paused");
    });

    it("resumes execution", () => {
        const store =
            useExecutionStore.getState();

        store.startExecution(2);
        store.pauseExecution();
        store.resumeExecution();

        const state =
            useExecutionStore.getState();

        expect(state.isPaused).toBe(false);
        expect(state.status).toBe("running");
    });

    it("stops execution", () => {
        const store =
            useExecutionStore.getState();

        store.startExecution(2);

        store.stopExecution();

        const state =
            useExecutionStore.getState();

        expect(state.isStopped).toBe(true);
        expect(state.status).toBe("stopped");
    });

    it("sets execution environment", () => {
        const store =
            useExecutionStore.getState();

        store.setEnvironment({
            platform: "Android",
            osVersion: "15",
            device: "Pixel 8",
            automation: "UiAutomator2",
            sessionId: "session-123",
        });

        expect(
            useExecutionStore
                .getState()
                .environment,
        ).toEqual({
            platform: "Android",
            osVersion: "15",
            device: "Pixel 8",
            automation: "UiAutomator2",
            sessionId: "session-123",
        });
    });

    it("updates only the provided environment fields", () => {
        const store =
            useExecutionStore.getState();

        store.setEnvironment({
            platform: "Android",
            device: "Pixel 8",
        });

        store.setEnvironment({
            osVersion: "15",
            sessionId: "session-123",
        });

        expect(
            useExecutionStore
                .getState()
                .environment,
        ).toEqual({
            platform: "Android",
            osVersion: "15",
            device: "Pixel 8",
            automation: "UiAutomator2",
            sessionId: "session-123",
        });
    });

    it("resets execution state", () => {
        const store =
            useExecutionStore.getState();

        store.startExecution(3);

        store.setCurrentNode("node-1");

        store.setNodeStatus(
            "node-1",
            "running",
        );

        store.setEdgeStatus(
            "edge-1",
            "running",
        );

        store.setNodeResult({
            nodeId: "node-1",
            nodeType: "tap",
            nodeTitle: "Tap",
            status: "passed",
            startedAt: 1000,
            finishedAt: 1100,
            duration: 100,
        });

        store.completeNode(true);

        store.stopExecution();

        store.reset();

        const state =
            useExecutionStore.getState();

        expect(state.status).toBe("idle");
        expect(state.appiumConnection).toBe(
            "checking",
        );

        expect(state.isPaused).toBe(false);
        expect(state.isStopped).toBe(false);
        expect(state.currentNodeId).toBeNull();

        expect(state.nodeStatus).toEqual({});
        expect(state.edgeStatus).toEqual({});
        expect(state.nodeResults).toEqual({});

        expect(state.totalNodes).toBe(0);
        expect(state.executedNodes).toBe(0);
        expect(state.passedNodes).toBe(0);
        expect(state.failedNodes).toBe(0);
        expect(state.progress).toBe(0);

        expect(state.startedAt).toBeNull();
        expect(state.finishedAt).toBeNull();
        expect(state.duration).toBe(0);
    });

    it("preserves device environment when resetting", () => {
        const store =
            useExecutionStore.getState();

        store.setEnvironment({
            platform: "iOS",
            osVersion: "18.6",
            device: "iPhone",
            automation: "XCUITest",
            sessionId: "session-456",
        });

        store.reset();

        expect(
            useExecutionStore
                .getState()
                .environment,
        ).toEqual({
            platform: "iOS",
            osVersion: "18.6",
            device: "iPhone",
            automation: "XCUITest",
            sessionId: null,
        });
    });

    it("can set Appium connection status", () => {
        const store =
            useExecutionStore.getState();

        store.setAppiumConnection(
            "connected",
        );

        expect(
            useExecutionStore
                .getState()
                .appiumConnection,
        ).toBe("connected");

        store.setAppiumConnection(
            "offline",
        );

        expect(
            useExecutionStore
                .getState()
                .appiumConnection,
        ).toBe("offline");
    });

    it("allows setting flow execution status directly", () => {
        const store =
            useExecutionStore.getState();

        store.setStatus("running");

        expect(
            useExecutionStore
                .getState()
                .status,
        ).toBe("running");

        store.setStatus("failed");

        expect(
            useExecutionStore
                .getState()
                .status,
        ).toBe("failed");
    });
});