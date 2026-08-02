import type { ScrollNodeData } from "../../flow/types/flowNode";

import { createSimpleEmitter } from "../factories/createSimpleEmitter";

import { quote } from "../utils/quote";

export const scrollEmitter =
    createSimpleEmitter<ScrollNodeData>(
        "scroll",

        (data) => [
            quote(data.direction),

            String(data.amount),
        ],
    );