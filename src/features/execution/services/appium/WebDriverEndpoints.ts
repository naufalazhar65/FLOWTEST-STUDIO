export const WebDriverEndpoints = {
    sessions: "/sessions",

    session: (sessionId: string) =>
        `/session/${sessionId}`,

    click: (
        sessionId: string,
        elementId: string,
    ) =>
        `/session/${sessionId}/element/${elementId}/click`,

    value: (
        sessionId: string,
        elementId: string,
    ) =>
        `/session/${sessionId}/element/${elementId}/value`,
} as const;