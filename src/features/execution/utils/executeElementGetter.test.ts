import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./storeResult", () => ({
    storeResult: vi.fn(),
}));

import { executeElementGetter } from "./executeElementGetter";
import { storeResult } from "./storeResult";
import { useExecutionLogStore } from "../store/useExecutionLogStore";

const storeResultMock = vi.mocked(storeResult);

describe("executeElementGetter", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        useExecutionLogStore.setState({
            logs: [],
            filter: "all",
        });

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
    });

    it("calls getter", async () => {
        const getter = vi.fn().mockResolvedValue("admin");

        await executeElementGetter(
            getter,
            "username",
            "Username",
        );

        expect(getter).toHaveBeenCalledTimes(1);
    });

    it("stores the result", async () => {
        const getter = vi.fn().mockResolvedValue("admin");

        await executeElementGetter(
            getter,
            "username",
            "Username",
        );

        expect(storeResultMock).toHaveBeenCalledTimes(1);

        expect(storeResultMock).toHaveBeenCalledWith(
            "username",
            "admin",
        );
    });

    it("adds a success log", async () => {
        const getter = vi.fn().mockResolvedValue("admin");

        await executeElementGetter(
            getter,
            "username",
            "Username",
        );

        const logs =
            useExecutionLogStore.getState().logs;

        expect(logs).toHaveLength(1);

        expect(logs[0]).toMatchObject({
            level: "success",
            message: "Username = admin",
        });
    });

    it("returns next output", async () => {
        const getter = vi.fn().mockResolvedValue("admin");

        const result =
            await executeElementGetter(
                getter,
                "username",
                "Username",
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("propagates getter errors", async () => {
        const getter = vi
            .fn()
            .mockRejectedValue(
                new Error("Getter failed"),
            );

        await expect(
            executeElementGetter(
                getter,
                "username",
                "Username",
            ),
        ).rejects.toThrow("Getter failed");

        expect(storeResultMock).not.toHaveBeenCalled();

        expect(
            useExecutionLogStore.getState().logs,
        ).toHaveLength(0);
    });
});