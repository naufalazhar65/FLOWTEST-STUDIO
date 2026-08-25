import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    clearVariables,
    getVariable,
} from "../../execution/variables/VariableStore";

import {
    loadTestDataRow,
} from "./loadTestDataRow";

describe(
    "loadTestDataRow",
    () => {
        beforeEach(() => {
            clearVariables();
        });

        it(
            "loads row values into runtime variables",
            () => {
                loadTestDataRow({
                    username:
                        "user1",

                    password:
                        "pass1",

                    retries:
                        3,
                });

                expect(
                    getVariable(
                        "username",
                    ),
                ).toBe(
                    "user1",
                );

                expect(
                    getVariable(
                        "password",
                    ),
                ).toBe(
                    "pass1",
                );

                expect(
                    getVariable(
                        "retries",
                    ),
                ).toBe(3);
            },
        );

        it(
            "replaces variables from the previous row",
            () => {
                loadTestDataRow({
                    username:
                        "user1",

                    oldValue:
                        "should-disappear",
                });

                expect(
                    getVariable(
                        "oldValue",
                    ),
                ).toBe(
                    "should-disappear",
                );

                loadTestDataRow({
                    username:
                        "user2",
                });

                expect(
                    getVariable(
                        "username",
                    ),
                ).toBe(
                    "user2",
                );

                expect(
                    getVariable(
                        "oldValue",
                    ),
                ).toBeUndefined();
            },
        );
    },
);