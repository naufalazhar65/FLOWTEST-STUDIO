export interface ElementInfo {
    id: string;

    tagName: string;

    text?: string;

    label?: string;

    value?: string;

    name?: string;

    contentDescription?: string;

    resourceId?: string;

    className?: string;

    bounds?: string;

    displayed?: boolean;

    enabled?: boolean;

    selected?: boolean;

    accessible?: boolean;

    semanticLabel?: string;

    parentLabel?: string;

    parentName?: string;

    children: ElementInfo[];
}