import {
    FileCode2,
    FileText,
    FileJson2,
    Settings2,
    Package,
} from "lucide-react";

export function getFileIcon(
    path: string,
) {
    if (path.endsWith(".py")) {
        return (
            <FileCode2
                size={16}
                color="#4FC3F7"
            />
        );
    }

    if (path.endsWith(".md")) {
        return (
            <FileText
                size={16}
                color="#42A5F5"
            />
        );
    }

    if (path.endsWith(".json")) {
        return (
            <FileJson2
                size={16}
                color="#FBC02D"
            />
        );
    }

    if (path.endsWith(".ini")) {
        return (
            <Settings2
                size={16}
                color="#FFB300"
            />
        );
    }

    if (
        path === "requirements.txt"
    ) {
        return (
            <Package
                size={16}
                color="#66BB6A"
            />
        );
    }

    return (
        <FileText
            size={16}
            color="#A0AEC0"
        />
    );
}