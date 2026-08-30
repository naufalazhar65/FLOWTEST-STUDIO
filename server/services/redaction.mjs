export function isSensitiveKey(key) {
    const normalized = String(key || "").replace(/[-_]/g, "").toLowerCase();
    return (
        normalized === "password" ||
        normalized === "passwd" ||
        normalized === "secret" ||
        normalized === "token" ||
        normalized === "authorization" ||
        normalized === "apikey" ||
        normalized === "accesstoken" ||
        normalized === "refreshtoken" ||
        normalized === "cvv" ||
        normalized === "pin"
    );
}

export function redactSensitiveValue(value, key = null) {
    if (key && isSensitiveKey(key)) {
        return "[REDACTED]";
    }

    if (Array.isArray(value)) {
        return value.map((item) => redactSensitiveValue(item));
    }

    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([entryKey, entryValue]) => [
                entryKey,
                redactSensitiveValue(entryValue, entryKey),
            ])
        );
    }

    return value;
}
