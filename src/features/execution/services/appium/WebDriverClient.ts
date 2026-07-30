import { appiumConfig } from "./config";




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
        method: "GET" | "POST" | "DELETE",
        path: string,
        body?: unknown,
    ): Promise<T> {
        const response = await fetch(
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
                        : JSON.stringify(body),
            },
        );

        const text = await response.text();

        const payload =
            text.length === 0
                ? undefined
                : JSON.parse(text);

        if (!response.ok) {
            if (!response.ok) {
                if (
                    payload &&
                    typeof payload === "object" &&
                    "value" in payload
                ) {
                    const value =
                        (payload as {
                            value?: {
                                message?: string;
                            };
                        }).value;

                    throw new Error(
                        value?.message ??
                        response.statusText,
                    );
                }

                throw new Error(
                    response.statusText,
                );
            }
        }

        return payload as T;
    }
}

export const webDriverClient =
    new WebDriverClient(
        appiumConfig.baseUrl,
    );