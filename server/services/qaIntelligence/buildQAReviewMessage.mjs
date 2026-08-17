import {
    buildQARecommendations,
} from "./buildQARecommendations.mjs";

function getSeverityIcon(
    severity,
) {
    if (
        severity ===
        "error"
    ) {
        return "🔴";
    }

    if (
        severity ===
        "warning"
    ) {
        return "⚠️";
    }

    return "ℹ️";
}

function getSeverityLabel(
    severity,
) {
    if (
        severity ===
        "error"
    ) {
        return "Error";
    }

    if (
        severity ===
        "warning"
    ) {
        return "Warning";
    }

    return "Info";
}

function getPriorityIcon(
    priority,
) {
    if (
        priority ===
        "critical"
    ) {
        return "🔴";
    }

    if (
        priority ===
        "high"
    ) {
        return "🟠";
    }

    if (
        priority ===
        "medium"
    ) {
        return "🟡";
    }

    return "🟢";
}

function getPriorityLabel(
    priority,
    language,
) {
    if (
        language === "en"
    ) {
        if (
            priority ===
            "critical"
        ) {
            return "Critical";
        }

        if (
            priority ===
            "high"
        ) {
            return "High";
        }

        if (
            priority ===
            "medium"
        ) {
            return "Medium";
        }

        return "Low";
    }

    if (
        priority ===
        "critical"
    ) {
        return "Kritis";
    }

    if (
        priority ===
        "high"
    ) {
        return "Tinggi";
    }

    if (
        priority ===
        "medium"
    ) {
        return "Sedang";
    }

    return "Rendah";
}

export function buildQAReviewMessage(
    analysis,
    language = "id",
) {
    if (
        !analysis ||
        typeof analysis !==
            "object"
    ) {
        return language === "en"
            ? "No QA review data is available."
            : "Data review QA tidak tersedia.";
    }

    const findings =
        Array.isArray(
            analysis.findings,
        )
            ? analysis.findings
            : [];

    const score =
        typeof analysis.score ===
        "number"
            ? analysis.score
            : 0;

    const nodeCount =
        typeof analysis.nodeCount ===
        "number"
            ? analysis.nodeCount
            : 0;

    const edgeCount =
        typeof analysis.edgeCount ===
        "number"
            ? analysis.edgeCount
            : 0;

    const errors =
        findings.filter(
            (finding) =>
                finding?.severity ===
                "error",
        );

    const warnings =
        findings.filter(
            (finding) =>
                finding?.severity ===
                "warning",
        );

    const infos =
        findings.filter(
            (finding) =>
                finding?.severity ===
                "info",
        );

    const recommendations =
    buildQARecommendations(
        analysis,
    );

    const lines = [];

    if (
        language === "en"
    ) {
        lines.push(
            "## QA Flow Review",
            "",
            `**Quality Score:** ${score}/100`,
            "",
            `**Flow:** ${nodeCount} nodes, ${edgeCount} edges`,
            "",
        );

        if (
    recommendations.length >
    0
) {
    lines.push(
        "## Recommended Improvements",
        "",
    );

    recommendations
        .slice(0, 5)
        .forEach(
            (
                recommendation,
            ) => {
                lines.push(
                    `${getPriorityIcon(
                        recommendation.priority,
                    )} **${getPriorityLabel(
                        recommendation.priority,
                        language,
                    )} Priority — ${
                        recommendation.title
                    }**`,
                );

                if (
                    recommendation.nodeId
                ) {
                    lines.push(
                        `- Node: \`${recommendation.nodeId}\``,
                    );
                }

                lines.push(
                    `- Impact: ${recommendation.impact}`,
                );

                lines.push(
                    `- ${recommendation.description}`,
                );

                if (
                    recommendation.recommendation
                ) {
                    lines.push(
                        `- Recommendation: ${recommendation.recommendation}`,
                    );
                }

                if (
                    recommendation.suggestedFix
                ) {
                    lines.push(
                        `- Suggested fix: \`${recommendation.suggestedFix.type}\``,
                    );
                }

                lines.push("");
            },
        );
}

        lines.push(
            "## Findings",
            "",
        );

        if (
            findings.length ===
            0
        ) {
            lines.push(
                "✅ No significant QA quality issues were detected.",
                "",
            );
        } else {
            findings.forEach(
                (finding) => {
                    lines.push(
                        `${getSeverityIcon(
                            finding.severity,
                        )} **${getSeverityLabel(
                            finding.severity,
                        )}: ${finding.title}**`,
                    );

                    if (
                        finding.nodeId
                    ) {
                        lines.push(
                            `- Node: \`${finding.nodeId}\``,
                        );
                    }

                    lines.push(
                        `- ${finding.message}`,
                    );

                    lines.push(
                        `- Recommendation: ${finding.recommendation}`,
                        "",
                    );
                },
            );
        }

        lines.push(
            "## Summary",
            "",
            `- Errors: ${errors.length}`,
            `- Warnings: ${warnings.length}`,
            `- Informational findings: ${infos.length}`,
        );

        return lines.join(
            "\n",
        );
    }

    lines.push(
        "## Review Kualitas Flow",
        "",
        `**Quality Score:** ${score}/100`,
        "",
        `**Flow:** ${nodeCount} node, ${edgeCount} edge`,
        "",
    );

    if (
    recommendations.length >
    0
) {
    lines.push(
        "## Prioritas Perbaikan",
        "",
    );

    recommendations
        .slice(0, 5)
        .forEach(
            (
                recommendation,
            ) => {
                lines.push(
                    `${getPriorityIcon(
                        recommendation.priority,
                    )} **Prioritas ${getPriorityLabel(
                        recommendation.priority,
                        language,
                    )} — ${
                        recommendation.title
                    }**`,
                );

                if (
                    recommendation.nodeId
                ) {
                    lines.push(
                        `- Node: \`${recommendation.nodeId}\``,
                    );
                }

                lines.push(
                    `- Dampak: ${recommendation.impact}`,
                );

                lines.push(
                    `- ${recommendation.description}`,
                );

                if (
                    recommendation.recommendation
                ) {
                    lines.push(
                        `- Rekomendasi: ${recommendation.recommendation}`,
                    );
                }

                if (
                    recommendation.suggestedFix
                ) {
                    lines.push(
                        `- Suggested fix: \`${recommendation.suggestedFix.type}\``,
                    );
                }

                lines.push("");
            },
        );
}

    lines.push(
        "## Temuan",
        "",
    );

    if (
        findings.length ===
        0
    ) {
        lines.push(
            "✅ Tidak ditemukan masalah kualitas QA yang signifikan.",
            "",
        );
    } else {
        findings.forEach(
            (finding) => {
                lines.push(
                    `${getSeverityIcon(
                        finding.severity,
                    )} **${getSeverityLabel(
                        finding.severity,
                    )}: ${finding.title}**`,
                );

                if (
                    finding.nodeId
                ) {
                    lines.push(
                        `- Node: \`${finding.nodeId}\``,
                    );
                }

                lines.push(
                    `- ${finding.message}`,
                );

                lines.push(
                    `- Rekomendasi: ${finding.recommendation}`,
                    "",
                );
            },
        );
    }

    lines.push(
        "## Ringkasan",
        "",
        `- Error: ${errors.length}`,
        `- Warning: ${warnings.length}`,
        `- Temuan informasional: ${infos.length}`,
    );

    return lines.join(
        "\n",
    );
}