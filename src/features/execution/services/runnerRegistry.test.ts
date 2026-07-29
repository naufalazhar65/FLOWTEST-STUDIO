import { describe, expect, it } from "vitest";

import { getRunner } from "./runnerRegistry";
import type { NodeAction } from "../../flow/types/flowNode";

describe("runnerRegistry", () => {
    it("returns tap runner", () => {
        expect(getRunner("tap")).toBeDefined();
    });

    it("returns input runner", () => {
        expect(getRunner("input")).toBeDefined();
    });

    it("returns assert runner", () => {
        expect(getRunner("assert")).toBeDefined();
    });

    it("returns setVariable runner", () => {
        expect(getRunner("setVariable")).toBeDefined();
    });

    it("returns delay runner", () => {
        expect(getRunner("delay")).toBeDefined();
    });

    it("returns swipe runner", () => {
        expect(getRunner("swipe")).toBeDefined();
    });

    it("returns scroll runner", () => {
        expect(getRunner("scroll")).toBeDefined();
    });

    it("returns wait runner", () => {
        expect(getRunner("wait")).toBeDefined();
    });

    it("returns launchApp runner", () => {
        expect(getRunner("launchApp")).toBeDefined();
    });

    it("returns closeApp runner", () => {
        expect(getRunner("closeApp")).toBeDefined();
    });

    it("returns back runner", () => {
        expect(getRunner("back")).toBeDefined();
    });

    it("returns home runner", () => {
        expect(getRunner("home")).toBeDefined();
    });

    it("returns screenshot runner", () => {
        expect(getRunner("screenshot")).toBeDefined();
    });

    it("returns if runner", () => {
        expect(getRunner("if")).toBeDefined();
    });

    it("throws when runner is not registered", () => {
    expect(() =>
        getRunner(
            "unknown" as NodeAction
        )
    ).toThrow(
        "No runner registered for unknown"
    );
});
});