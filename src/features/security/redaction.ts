import {
    useEnvironmentStore,
} from "../environment/store/useEnvironmentStore";

export function isSensitiveKey(
    key: string,
): boolean {
    const normalized =
        key
            .replace(
                /[-_]/g,
                "",
            )
            .toLowerCase();

    return (
        normalized ===
            "password" ||
        normalized ===
            "passwd" ||
        normalized ===
            "secret" ||
        normalized ===
            "token" ||
        normalized ===
            "authorization" ||
        normalized ===
            "apikey" ||
        normalized ===
            "accesstoken" ||
        normalized ===
            "refreshtoken" ||
        normalized ===
            "cvv" ||
        normalized ===
            "pin"
    );
}

function getSecretValues(): Set<string> {
    try {
        const {
            environments,
        } =
            useEnvironmentStore.getState();

        const values =
            new Set<string>();

        for (
            const environment of
            environments
        ) {
            const variables =
                environment.variables ??
                {};

            for (
                const variable of
                Object.values(
                    variables,
                )
            ) {
                if (
                    !variable ||
                    typeof variable !==
                        "object"
                ) {
                    continue;
                }

                const typed =
                    variable as {
                        value?: unknown;
                        secret?: unknown;
                    };

                if (
                    typed.secret ===
                        true &&
                    typeof typed.value ===
                        "string" &&
                    typed.value.length >
                        0
                ) {
                    values.add(
                        typed.value,
                    );
                }
            }
        }

        return values;
    } catch {
        return new Set<string>();
    }
}

function isSecretStringValue(
    value: string,
    secrets: Set<string>,
): boolean {
    if (
        secrets.has(
            value,
        )
    ) {
        return true;
    }

    for (
        const secret of
        secrets
    ) {
        if (
            secret.length >=
                4 &&
            value.includes(
                secret,
            )
        ) {
            return true;
        }
    }

    return false;
}

export function redactSensitiveValue(
    value: unknown,
    key?: string,
): unknown {
    if (
        key &&
        isSensitiveKey(
            key,
        )
    ) {
        return "[REDACTED]";
    }

    if (
        typeof value ===
        "string"
    ) {
        const secrets =
            getSecretValues();

        if (
            secrets.size >
                0 &&
            isSecretStringValue(
                value,
                secrets,
            )
        ) {
            return "[REDACTED]";
        }
    }

    if (
        Array.isArray(
            value,
        )
    ) {
        return value.map(
            (
                item,
            ) =>
                redactSensitiveValue(
                    item,
                ),
        );
    }

    if (
        value &&
        typeof value ===
            "object"
    ) {
        return Object.fromEntries(
            Object.entries(
                value as Record<
                    string,
                    unknown
                >,
            ).map(
                ([
                    entryKey,
                    entryValue,
                ]) => [
                    entryKey,
                    redactSensitiveValue(
                        entryValue,
                        entryKey,
                    ),
                ],
            ),
        );
    }

    return value;
}
