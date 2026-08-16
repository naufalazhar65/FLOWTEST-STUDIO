import "dotenv/config";

import express from "express";
import cors from "cors";

import {
    generateAIResponse,
} from "./services/ollamaService.mjs";

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
            service: "flowtest-ai",
            provider: "ollama",
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
            } = req.body;

            if (
                typeof message !== "string" ||
                !message.trim()
            ) {
                return res.status(400).json({
                    error:
                        "message is required.",
                });
            }

            if (
                !context ||
                typeof context !==
                    "object"
            ) {
                return res.status(400).json({
                    error:
                        "context is required.",
                });
            }

            const result =
                await generateAIResponse({
                    message:
                        message.trim(),
                    context,
                });

            return res.json(result);
        } catch (error) {
            console.error(
                "[AI API]",
                error,
            );

            return res.status(500).json({
                error:
                    error instanceof Error
                        ? error.message
                        : String(error),
            });
        }
    },
);

app.listen(
    port,
    () => {
        console.log(
            `FlowTest AI server running on http://localhost:${port}`,
        );
    },
);