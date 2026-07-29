import { describe, expect, it } from "vitest";

import { formatDuration } from "./formatDuration";

describe("formatDuration", () => {
    it("formats values below one second", () => {
        expect(formatDuration(0)).toBe("0 ms");
        expect(formatDuration(1)).toBe("1 ms");
        expect(formatDuration(250)).toBe("250 ms");
        expect(formatDuration(999)).toBe("999 ms");
    });

    it("rounds millisecond values", () => {
        expect(formatDuration(250.4)).toBe("250 ms");
        expect(formatDuration(250.6)).toBe("251 ms");
    });

    it("formats one second", () => {
        expect(formatDuration(1000)).toBe("1.00 s");
    });

    it("formats values above one second", () => {
        expect(formatDuration(1500)).toBe("1.50 s");
        expect(formatDuration(2534)).toBe("2.53 s");
        expect(formatDuration(60000)).toBe("60.00 s");
    });
});