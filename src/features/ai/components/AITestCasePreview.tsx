import type {
    AITestCase,
} from "../types/AITestCase";

interface AITestCasePreviewProps {
    testCases: AITestCase[];

    onApprove?: () => void;

    onCancel?: () => void;
}

export function AITestCasePreview({
    testCases,
    onApprove,
    onCancel,
}: AITestCasePreviewProps) {
    return (
        <div
            style={{
                marginTop: 12,
                padding: 12,
                border:
                    "1px solid #30363D",
                borderRadius: 10,
                background:
                    "#161B22",
            }}
        >
            <div
                style={{
                    marginBottom: 8,
                    color: "#E6EDF3",
                    fontSize: 13,
                    fontWeight: 600,
                }}
            >
                AI Test Cases
            </div>

            <div
                style={{
                    marginBottom: 12,
                    color: "#8B949E",
                    fontSize: 12,
                    lineHeight: 1.5,
                }}
            >
                Review generated test
                cases before converting
                them into an executable
                flow.
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection:
                        "column",
                    gap: 10,
                }}
            >
                {testCases.map(
                    (
                        testCase,
                        index,
                    ) => (
                        <div
                            key={
                                testCase.id
                            }
                            style={{
                                padding: 10,
                                border:
                                    "1px solid #30363D",
                                borderRadius:
                                    8,
                                background:
                                    "#0D1117",
                            }}
                        >
                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "flex-start",
                                    gap: 10,
                                }}
                            >
                                <div
                                    style={{
                                        width: 24,
                                        height: 24,
                                        flexShrink: 0,
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        borderRadius:
                                            "50%",
                                        background:
                                            "#21262D",
                                        color:
                                            "#8B949E",
                                        fontSize: 11,
                                        fontWeight: 600,
                                    }}
                                >
                                    {index +
                                        1}
                                </div>

                                <div
                                    style={{
                                        minWidth:
                                            0,
                                        flex: 1,
                                    }}
                                >
                                    <div
                                        style={{
                                            color:
                                                "#E6EDF3",
                                            fontSize: 12,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {
                                            testCase.title
                                        }
                                    </div>

                                    {testCase.description && (
                                        <div
                                            style={{
                                                marginTop:
                                                    3,
                                                color:
                                                    "#8B949E",
                                                fontSize: 11,
                                                lineHeight:
                                                    1.4,
                                            }}
                                        >
                                            {
                                                testCase.description
                                            }
                                        </div>
                                    )}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            flexWrap:
                                                "wrap",
                                            gap: 6,
                                            marginTop:
                                                6,
                                        }}
                                    >
                                        <span
                                            style={{
                                                padding:
                                                    "2px 6px",
                                                borderRadius:
                                                    5,
                                                background:
                                                    "#21262D",
                                                color:
                                                    "#A371F7",
                                                fontSize:
                                                    10,
                                            }}
                                        >
                                            {
                                                testCase.id
                                            }
                                        </span>

                                        <span
                                            style={{
                                                padding:
                                                    "2px 6px",
                                                borderRadius:
                                                    5,
                                                background:
                                                    "#21262D",
                                                color:
                                                    "#58A6FF",
                                                fontSize:
                                                    10,
                                            }}
                                        >
                                            {
                                                testCase.type
                                            }
                                        </span>

                                        <span
                                            style={{
                                                padding:
                                                    "2px 6px",
                                                borderRadius:
                                                    5,
                                                background:
                                                    "#21262D",
                                                color:
                                                    "#D29922",
                                                fontSize:
                                                    10,
                                            }}
                                        >
                                            {
                                                testCase.priority
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {testCase.preconditions.length >
                                0 && (
                                <div
                                    style={{
                                        marginTop:
                                            10,
                                    }}
                                >
                                    <div
                                        style={{
                                            marginBottom:
                                                5,
                                            color:
                                                "#C9D1D9",
                                            fontSize:
                                                11,
                                            fontWeight:
                                                600,
                                        }}
                                    >
                                        Preconditions
                                    </div>

                                    <ul
                                        style={{
                                            margin:
                                                0,
                                            paddingLeft:
                                                18,
                                            color:
                                                "#8B949E",
                                            fontSize:
                                                11,
                                            lineHeight:
                                                1.5,
                                        }}
                                    >
                                        {testCase.preconditions.map(
                                            (
                                                item,
                                                itemIndex,
                                            ) => (
                                                <li
                                                    key={`${testCase.id}-precondition-${itemIndex}`}
                                                >
                                                    {
                                                        item
                                                    }
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            <div
                                style={{
                                    marginTop:
                                        10,
                                }}
                            >
                                <div
                                    style={{
                                        marginBottom:
                                            5,
                                        color:
                                            "#C9D1D9",
                                        fontSize:
                                            11,
                                        fontWeight:
                                            600,
                                    }}
                                >
                                    Steps
                                </div>

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        flexDirection:
                                            "column",
                                        gap: 6,
                                    }}
                                >
                                    {testCase.steps.map(
                                        (
                                            step,
                                        ) => (
                                            <div
                                                key={`${testCase.id}-step-${step.order}`}
                                                style={{
                                                    display:
                                                        "flex",
                                                    gap: 8,
                                                    padding:
                                                        "7px 8px",
                                                    border:
                                                        "1px solid #30363D",
                                                    borderRadius:
                                                        7,
                                                    background:
                                                        "#161B22",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 20,
                                                        flexShrink: 0,
                                                        color:
                                                            "#8B949E",
                                                        fontSize:
                                                            10,
                                                        fontWeight:
                                                            600,
                                                    }}
                                                >
                                                    {
                                                        step.order
                                                    }
                                                </div>

                                                <div
                                                    style={{
                                                        minWidth:
                                                            0,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            color:
                                                                "#E6EDF3",
                                                            fontSize:
                                                                11,
                                                            lineHeight:
                                                                1.4,
                                                        }}
                                                    >
                                                        {
                                                            step.action
                                                        }
                                                    </div>

                                                    {step.testData && (
                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    3,
                                                                color:
                                                                    "#8B949E",
                                                                fontSize:
                                                                    10,
                                                            }}
                                                        >
                                                            Test data:{" "}
                                                            {
                                                                step.testData
                                                            }
                                                        </div>
                                                    )}

                                                    {step.expected && (
                                                        <div
                                                            style={{
                                                                marginTop:
                                                                    3,
                                                                color:
                                                                    "#8B949E",
                                                                fontSize:
                                                                    10,
                                                            }}
                                                        >
                                                            Expected:{" "}
                                                            {
                                                                step.expected
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div
                                style={{
                                    marginTop:
                                        10,
                                    padding:
                                        "8px 9px",
                                    border:
                                        "1px solid #30363D",
                                    borderRadius:
                                        7,
                                    background:
                                        "#161B22",
                                }}
                            >
                                <div
                                    style={{
                                        marginBottom:
                                            3,
                                        color:
                                            "#C9D1D9",
                                        fontSize:
                                            11,
                                        fontWeight:
                                            600,
                                    }}
                                >
                                    Expected Result
                                </div>

                                <div
                                    style={{
                                        color:
                                            "#8B949E",
                                        fontSize:
                                            11,
                                        lineHeight:
                                            1.5,
                                    }}
                                >
                                    {
                                        testCase.expectedResult
                                    }
                                </div>
                            </div>
                        </div>
                    ),
                )}
            </div>

            <div
                style={{
                    display:
                        "flex",
                    justifyContent:
                        "flex-end",
                    gap: 8,
                    marginTop: 12,
                }}
            >
                {onCancel && (
                    <button
                        type="button"
                        onClick={
                            onCancel
                        }
                        style={{
                            padding:
                                "7px 12px",
                            border:
                                "1px solid #30363D",
                            borderRadius:
                                7,
                            background:
                                "transparent",
                            color:
                                "#8B949E",
                            fontSize: 12,
                            cursor:
                                "pointer",
                        }}
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="button"
                    onClick={
                        onApprove
                    }
                    disabled={
                        !onApprove
                    }
                    title="Approve generated test cases"
                    style={{
                        padding:
                            "7px 12px",
                        border:
                            "1px solid #238636",
                        borderRadius:
                            7,
                        background:
                            "#238636",
                        color:
                            "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor:
                            onApprove
                                ? "pointer"
                                : "not-allowed",
                    }}
                >
                    Approve Test Cases
                </button>
            </div>
        </div>
    );
}