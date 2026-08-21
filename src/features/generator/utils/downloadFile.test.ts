import { describe, expect, it, vi, afterEach } from "vitest";

import { downloadFile } from "./downloadFile";

describe("downloadFile", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("downloads a file", () => {
        const anchor =
            document.createElement("a");

        const clickSpy = vi.spyOn(
            anchor,
            "click",
        ).mockImplementation(() => { });

        vi.spyOn(
            document,
            "createElement",
        ).mockReturnValue(anchor);

        vi.spyOn(
            URL,
            "createObjectURL",
        ).mockReturnValue("blob:test");

        vi.spyOn(
            URL,
            "revokeObjectURL",
        ).mockImplementation(() => { });

        expect(() =>
            downloadFile(
                "test.py",
                "print('hello')",
            ),
        ).not.toThrow();

        expect(clickSpy).toHaveBeenCalledOnce();
    });
});
