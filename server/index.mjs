import "dotenv/config";

import express from "express";
import cors from "cors";

import {
    generateAIResponse,
} from "./services/ollamaService.mjs";

import {
    buildQAFixPlan,
} from "./services/qaIntelligence/buildQAFixPlan.mjs";

import {
    generateAITestCases,
} from "./services/qaIntelligence/generateAITestCases.mjs";

import {
    convertTestCaseToFlow,
} from "./services/qaIntelligence/convertTestCaseToFlow.mjs";

const app = express();

const port = Number(
    process.env.AI_SERVER_PORT ?? 8787,
);

app.use(cors());

app.use(
    express.json({
        limit: "1mb",
    }),
);

app.get(
    "/api/health",
    (_req, res) => {
        res.json({
            ok: true,

            service:
                "flowtest-ai",

            provider:
                "ollama",

            model:
                process.env.OLLAMA_MODEL ??
                "qwen3:1.7b",
        });
    },
);

app.post(
    "/api/ai",
    async (req, res) => {
        try {
            const {
                message,
                context,
                clarification,
            } = req.body;

            if (
                typeof message !==
                    "string" ||
                !message.trim()
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "message is required.",
                    });
            }

            if (
                !context ||
                typeof context !==
                    "object"
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "context is required.",
                    });
            }

            const result =
                await generateAIResponse({
                    message:
                        message.trim(),

                    context,

                    clarification:
                        clarification ??
                        null,
                });

            return res.json(
                result,
            );
        } catch (error) {
            console.error(
                "[AI API]",
                error,
            );

            return res
                .status(500)
                .json({
                    error:
                        error instanceof Error
                            ? error.message
                            : String(
                                error,
                            ),
                });
        }
    },
);

app.post(
    "/api/ai/qa/fix",
    async (req, res) => {
        try {
            const {
                recommendation,
                context,
            } = req.body;

            if (
                !recommendation ||
                typeof recommendation !==
                    "object"
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "recommendation is required.",
                    });
            }

            if (
                !context ||
                typeof context !==
                    "object"
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "context is required.",
                    });
            }

            const modificationPlan =
                buildQAFixPlan(
                    recommendation,
                    context,
                );

            if (
                !modificationPlan
            ) {
                return res
                    .status(422)
                    .json({
                        error:
                            "Unable to build a QA fix plan for this recommendation.",
                    });
            }

            return res.json({
                modificationPlan,
            });
        } catch (error) {
            console.error(
                "[QA Fix API]",
                error,
            );

            return res
                .status(500)
                .json({
                    error:
                        error instanceof Error
                            ? error.message
                            : String(
                                error,
                            ),
                });
        }
    },
);

app.post(
    "/api/ai/test-cases",
    async (req, res) => {
        try {
            const {
                requirement,
            } = req.body;

            if (
                typeof requirement !==
                    "string" ||
                !requirement.trim()
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "requirement is required.",
                    });
            }

            const result =
                await generateAITestCases(
                    requirement.trim(),
                );

            return res.json(
                result,
            );
        } catch (error) {
            console.error(
                "[AI Test Cases API]",
                error,
            );

            return res
                .status(500)
                .json({
                    error:
                        error instanceof Error
                            ? error.message
                            : String(
                                error,
                            ),
                });
        }
    },
);

app.post(
    "/api/ai/test-cases/to-flow",
    async (req, res) => {
        try {
            const {
                testCase,
                context,
            } = req.body;

            if (
                !testCase ||
                typeof testCase !==
                    "object"
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "testCase is required.",
                    });
            }

            if (
                !context ||
                typeof context !==
                    "object"
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "context is required.",
                    });
            }

            const result =
                await convertTestCaseToFlow(
                    testCase,
                    context,
                );

            return res.json(
                result,
            );
        } catch (error) {
            console.error(
                "[AI Test Case Flow API]",
                error,
            );

            return res
                .status(500)
                .json({
                    error:
                        error instanceof Error
                            ? error.message
                            : String(
                                error,
                            ),
                });
        }
    },
);

app.listen(
    port,
    () => { 
    },
);