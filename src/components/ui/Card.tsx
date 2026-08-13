import type {
    CSSProperties,
    ReactNode,
} from "react";

import {
    animation,
    colors,
    radius,
    shadow,
} from "../../themes";

interface Props {
    children: ReactNode;

    padding?: number;

    hoverable?: boolean;

    style?: CSSProperties;
}

export function Card({
    children,
    padding,
    hoverable = false,
    style,
}: Props) {
    return (
        <div
            style={{
                background:
                    colors.panel,

                border:
                    `1px solid ${colors.border}`,

                borderRadius:
                    radius.md,

                boxShadow:
                    shadow.card,

                padding,

                transition: hoverable
                    ? `transform ${animation.fast}, border-color ${animation.fast}, box-shadow ${animation.fast}`
                    : undefined,

                ...style,
            }}
            onMouseEnter={
                hoverable
                    ? (event) => {
                        event.currentTarget
                            .style
                            .borderColor =
                            colors
                                .borderLight;

                        event.currentTarget
                            .style
                            .transform =
                            "translateY(-2px)";

                        event.currentTarget
                            .style
                            .boxShadow =
                            shadow.panel;
                    }
                    : undefined
            }
            onMouseLeave={
                hoverable
                    ? (event) => {
                        event.currentTarget
                            .style
                            .borderColor =
                            colors
                                .border;

                        event.currentTarget
                            .style
                            .transform =
                            "translateY(0)";

                        event.currentTarget
                            .style
                            .boxShadow =
                            shadow.card;
                    }
                    : undefined
            }
        >
            {children}
        </div>
    );
}