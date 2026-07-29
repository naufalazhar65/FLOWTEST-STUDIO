import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { resolveNodeVariables } from "./resolveNodeVariables";
import * as ResolveVariable from "./resolveVariable";

vi.mock("./resolveVariable", () => ({
    resolveVariables: vi.fn(),
}));

describe("resolveNodeVariables", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(
            ResolveVariable.resolveVariables
        ).mockImplementation((value) =>
            value.replace("${name}", "Naufal")
        );
    });

    it("resolves string values", () => {
        expect(
            resolveNodeVariables({
                text: "Hello ${name}",
            })
        ).toEqual({
            text: "Hello Naufal",
        });
    });

    it("resolves nested objects", () => {
        expect(
            resolveNodeVariables({
                config: {
                    text: "Hello ${name}",
                },
            })
        ).toEqual({
            config: {
                text: "Hello Naufal",
            },
        });
    });

    it("resolves arrays", () => {
        expect(
            resolveNodeVariables({
                values: [
                    "${name}",
                    "Hi ${name}",
                ],
            })
        ).toEqual({
            values: [
                "Naufal",
                "Hi Naufal",
            ],
        });
    });

    it("keeps numbers unchanged", () => {
        expect(
            resolveNodeVariables({
                timeout: 5000,
            })
        ).toEqual({
            timeout: 5000,
        });
    });

    it("keeps booleans unchanged", () => {
        expect(
            resolveNodeVariables({
                enabled: true,
            })
        ).toEqual({
            enabled: true,
        });
    });

    it("keeps null unchanged", () => {
        expect(
            resolveNodeVariables({
                value: null,
            })
        ).toEqual({
            value: null,
        });
    });

    it("keeps undefined unchanged", () => {
        expect(
            resolveNodeVariables({
                value: undefined,
            })
        ).toEqual({
            value: undefined,
        });
    });

    it("calls resolveVariables for every string", () => {
        resolveNodeVariables({
            first: "${name}",
            nested: {
                second: "Hi ${name}",
            },
            values: [
                "${name}",
            ],
        });

        expect(
            ResolveVariable.resolveVariables
        ).toHaveBeenCalledTimes(3);
    });

    it("resolves objects inside arrays", () => {
        expect(
            resolveNodeVariables({
                users: [
                    {
                        name: "${name}",
                    },
                ],
            })
        ).toEqual({
            users: [
                {
                    name: "Naufal",
                },
            ],
        });
    });
});