import { beforeEach, describe, expect, it, vi } from "vitest";

import { useExecutionLogStore } from "./useExecutionLogStore";

describe("useExecutionLogStore", () => {
    beforeEach(() => {
        vi.restoreAllMocks();

        vi.spyOn(
            crypto,
            "randomUUID",
        ).mockReturnValue(
            "123e4567-e89b-12d3-a456-426614174000",
        );

        vi.spyOn(
            Date,
            "now",
        ).mockReturnValue(123456789);

        useExecutionLogStore.setState({
            logs: [],
            filter: "all",
        });
    });

    it("has the correct initial state", () => {
        const state =
            useExecutionLogStore.getState();

        expect(state.logs).toEqual([]);

        expect(state.filter).toBe("all");
    });

    it("adds a log", () => {
        useExecutionLogStore
            .getState()
            .addLog({
                level: "info",

                message: "Node executed",

                nodeId: "node-1",

                nodeType: "tap",

                duration: 100,
            });

        const logs =
            useExecutionLogStore.getState().logs;

        expect(logs).toHaveLength(1);

        expect(logs[0]).toEqual({
            id: "123e4567-e89b-12d3-a456-426614174000",

            level: "info",

            message: "Node executed",

            timestamp: 123456789,

            duration: 100,

            nodeId: "node-1",

            nodeType: "tap",
        });
    });

    it("clears all logs", () => {
        const store =
            useExecutionLogStore.getState();

        store.addLog({
            level: "success",

            message: "Finished",
        });

        expect(
            useExecutionLogStore.getState().logs,
        ).toHaveLength(1);

        store.clear();

        expect(
            useExecutionLogStore.getState().logs,
        ).toEqual([]);
    });

    it("changes the active filter", () => {
        useExecutionLogStore
            .getState()
            .setFilter("error");

        expect(
            useExecutionLogStore.getState().filter,
        ).toBe("error");
    });

    it("stores optional metadata", () => {
        useExecutionLogStore
            .getState()
            .addLog({
                level: "error",

                message: "Tap failed",

                nodeId: "tap-1",

                nodeType: "tap",

                nodeTitle: "Tap",

                duration: 350,

                details: {
                    locator: "login_button",

                    reason: "Element not found",
                },
            });

        const log =
            useExecutionLogStore.getState().logs[0];

        expect(log.nodeTitle).toBe("Tap");

        expect(log.details).toEqual({
            locator: "login_button",
            reason: "Element not found",
        });
    });
});