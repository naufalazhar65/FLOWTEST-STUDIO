import {
    describe,
    expect,
    it,
} from "vitest";

import { ifEmitter } from "./IfEmitter";
import type { GeneratorContext } from "../types/GeneratorContext";

const context = {} as GeneratorContext;

describe(

    "ifEmitter",
    () => {
        it(
            "emits literal values without resolve_variables",
            () => {
                const node =
                    {
                        data: {
                            action: "if",
                            title: "If",
                            subtitle:
                                "Condition",
                            debug: {
                                breakpoint:
                                    false,
                            },
                            actual: "test",
                            operator:
                                "equals",
                            expected:
                                "test",
                        },
                    } as any;

                expect(
                    ifEmitter.emit(
                        node,
                        context,
                    )
                ).toBe(
                    'if compare("test", "test", "equals"):',
                );
            },
        );

        it(
            "resolves variable values",
            () => {
                const node =
                    {
                        data: {
                            action: "if",
                            title: "If",
                            subtitle:
                                "Condition",
                            debug: {
                                breakpoint:
                                    false,
                            },
                            actual:
                                "${usernameText}",
                            operator:
                                "equals",
                            expected:
                                "test",
                        },
                    } as any;

                expect(
                    ifEmitter.emit(
                        node,
                        context,
                    )
                ).toBe(
                    'if compare(resolve_variables("${usernameText}"), "test", "equals"):',
                );
            },
        );

        it(
            "resolves variables on both sides",
            () => {
                const node =
                    {
                        data: {
                            action: "if",
                            title: "If",
                            subtitle:
                                "Condition",
                            debug: {
                                breakpoint:
                                    false,
                            },
                            actual:
                                "${actualValue}",
                            operator:
                                "equals",
                            expected:
                                "${expectedValue}",
                        },
                    } as any;

                expect(
                    ifEmitter.emit(
                        node,
                        context,
                    )
                ).toBe(
                    'if compare(resolve_variables("${actualValue}"), resolve_variables("${expectedValue}"), "equals"):',
                );
            },
        );

        it(
            "preserves whitespace inside literal values",
            () => {
                const node =
                    {
                        data: {
                            action: "if",
                            title: "If",
                            subtitle:
                                "Condition",
                            debug: {
                                breakpoint:
                                    false,
                            },
                            actual:
                                "Select a username from the list below",
                            operator:
                                "equals",
                            expected:
                                "Select a username from the list below",
                        },
                    } as any;

                expect(
                    ifEmitter.emit(
                        node,
                        context,
                    )
                ).toBe(
                    'if compare("Select a username from the list below", "Select a username from the list below", "equals"):',
                );
            },
        );
    },
);