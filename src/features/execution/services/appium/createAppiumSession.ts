import type {
    AppiumCapabilities,
} from "./AppiumSession";

import type {
    WebDriverClient,
} from "./WebDriverClient";

export interface CreateAppiumSessionOptions {
    maxAttempts?: number;

    retryDelayMs?: number;
}

export interface AppiumSessionResponse {
    sessionId: string;

    capabilities: AppiumCapabilities;
}

export async function createAppiumSession(
    client: WebDriverClient,
    capabilities: AppiumCapabilities,
    options: CreateAppiumSessionOptions = {},
): Promise<AppiumSessionResponse> {
    const maxAttempts =
        options.maxAttempts ?? 3;

    const retryDelayMs =
        options.retryDelayMs ?? 500;

    let lastError: unknown;

    for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt += 1
    ) {
        try {
            const response =
                await client.post<{
                    value: AppiumSessionResponse;
                }>(
                    "/session",
                    {
                        capabilities: {
                            alwaysMatch:
                                capabilities,
                        },
                    },
                );

            return response.value;
        } catch (error) {
            lastError = error;

            const retryable =
                error &&
                typeof error === "object" &&
                "retryable" in error &&
                (
                    error as {
                        retryable?: boolean;
                    }
                ).retryable === true;

            if (
                !retryable ||
                attempt >= maxAttempts
            ) {
                throw error;
            }

            await new Promise<void>(
                (resolve) =>
                    setTimeout(
                        resolve,
                        retryDelayMs,
                    ),
            );
        }
    }

    throw lastError instanceof Error
        ? lastError
        : new Error(
            "Unable to create Appium session.",
        );
}