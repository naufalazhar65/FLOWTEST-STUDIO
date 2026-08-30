import {
    describe,
    expect,
    it,
} from "vitest";
import {
    isSensitiveKey,
    redactSensitiveValue,
} from "./redaction";
import {
    useEnvironmentStore,
} from "../environment/store/useEnvironmentStore";

describe("isSensitiveKey", () => {
    it("detects exact sensitive keys", () => {
        expect(isSensitiveKey("password")).toBe(true);
        expect(isSensitiveKey("passwd")).toBe(true);
        expect(isSensitiveKey("secret")).toBe(true);
        expect(isSensitiveKey("token")).toBe(true);
        expect(isSensitiveKey("authorization")).toBe(true);
        expect(isSensitiveKey("apikey")).toBe(true);
        expect(isSensitiveKey("api_key")).toBe(true);
        expect(isSensitiveKey("access_token")).toBe(true);
        expect(isSensitiveKey("refresh_token")).toBe(true);
    });
    it("is case-insensitive and handles dashes", () => {
        expect(isSensitiveKey("PASSWORD")).toBe(true);
        expect(isSensitiveKey("Api-Key")).toBe(true);
        expect(isSensitiveKey("accessToken")).toBe(true); // normalize removes nothing, lowers to "accesstoken" == "accesstoken"
    });
    it("rejects non-sensitive keys", () => {
        expect(isSensitiveKey("username")).toBe(false);
        expect(isSensitiveKey("email")).toBe(false);
        expect(isSensitiveKey("deviceName")).toBe(false);
    });
});

describe("redactSensitiveValue", () => {
    it("redacts direct sensitive entry", () => {
        expect(redactSensitiveValue("hunter2", "password")).toBe("[REDACTED]");
    });
    it("replaces sensitive nested fields", () => {
        const input = {
            user: { name: "alice", token: "jwt-123" },
            nested: { secret: "shh" },
            list: [{ apiKey: "key-1" }, { ok: 123 }],
        };
        const result = redactSensitiveValue(input);
        expect(result).toEqual({
            user: { name: "alice", token: "[REDACTED]" },
            nested: { secret: "[REDACTED]" },
            list: [{ apiKey: "[REDACTED]" }, { ok: 123 }],
        });
    });
    it("supports arrays", () => {
        expect(redactSensitiveValue(["a", { secret: "s" }])).toEqual([
            "a",
            { secret: "[REDACTED]" },
        ]);
    });
    it("redacts string that matches env secret value", () => {
        const env =
            useEnvironmentStore.getState().getActiveEnvironment();
        const existingVars = { ...(env?.variables ?? {}) };
        // inject a secret env variable
        useEnvironmentStore
            .getState()
            .updateEnvironment({
                name: env!.name,
                variables: {
                    ...existingVars,
                    MY_SECRET_VAR: {
                        value: "super-secret-123",
                        secret: true,
                    },
                },
            } as never);
        expect(redactSensitiveValue("super-secret-123", "someKey")).toBe(
            "[REDACTED]"
        );
        expect(redactSensitiveValue("prefix super-secret-123 suffix")).toBe(
            "[REDACTED]"
        );
        // restore
        useEnvironmentStore
            .getState()
            .updateEnvironment({
                name: env!.name,
                variables: existingVars,
            } as never);
    });
});
