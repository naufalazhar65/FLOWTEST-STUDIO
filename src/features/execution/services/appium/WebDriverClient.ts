import {
    useAppiumConfigStore,
} from "../../store/useAppiumConfigStore";

export class WebDriverError extends Error {
    readonly status?: number;

    readonly retryable: boolean;

    constructor(
        message: string,
        options?: {
            status?: number;
            retryable?: boolean;
        },
    ) {
        super(message);

        this.name =
            "WebDriverError";

        this.status =
            options?.status;

        this.retryable =
            options?.retryable ?? false;
    }
}

export class WebDriverClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl.replace(/\/$/, "");
    }

    async get<T>(path: string): Promise<T> {
        return this.request<T>("GET", path);
    }

    async post<T>(
        path: string,
        body?: unknown,
    ): Promise<T> {
        return this.request<T>(
            "POST",
            path,
            body,
        );
    }

    async delete<T>(
        path: string,
    ) {
        return this.request<T>(
            "DELETE",
            path,
        );
    }

    private async request<T>(
        method:
            | "GET"
            | "POST"
            | "DELETE",
        path: string,
        body?: unknown,
    ): Promise<T> {
        let response: Response;

        try {
            response = await fetch(
                `${this.baseUrl}${path}`,
                {
                    method,

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        body === undefined
                            ? undefined
                            : JSON.stringify(
                                body,
                            ),
                },
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to connect to Appium server.";

            throw new WebDriverError(
                message,
                {
                    retryable: true,
                },
            );
        }

        const text =
            await response.text();

        const payload =
            text.length === 0
                ? undefined
                : JSON.parse(text);

        if (!response.ok) {
            let message =
                response.statusText;

            if (
                payload &&
                typeof payload === "object" &&
                "value" in payload
            ) {
                const value =
                    (
                        payload as {
                            value?: {
                                error?: string;
                                message?: string;
                            };
                        }
                    ).value;

                message =
                    value?.message ??
                    value?.error ??
                    response.statusText;
            }

            throw new WebDriverError(
                message,
                {
                    status:
                        response.status,

                    retryable:
                        response.status >= 500 &&
                        response.status < 600,
                },
            );
        }

        /*
         * Some WebDriver/Appium implementations may
         * return a protocol-level error payload even
         * when the HTTP response itself is successful.
         */
        if (
            payload &&
            typeof payload === "object" &&
            "value" in payload
        ) {
            const value =
                (
                    payload as {
                        value?: {
                            error?: string;
                            message?: string;
                        };
                    }
                ).value;

            if (
                value &&
                typeof value === "object" &&
                typeof value.error ===
                "string"
            ) {
                throw new WebDriverError(
                    value.message ??
                    value.error,
                    {
                        retryable: false,
                    },
                );
            }
        }

        return payload as T;
    }
}

export const webDriverClient =
    new WebDriverClient(
        useAppiumConfigStore
            .getState()
            .config.serverUrl,
    );