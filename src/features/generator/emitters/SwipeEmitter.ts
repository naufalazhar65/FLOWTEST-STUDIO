import type { SwipeNodeData } from "../../flow/types/flowNode";

import { createSimpleEmitter } from "../factories/createSimpleEmitter";

import { quote } from "../utils/quote";

export const swipeEmitter =
    createSimpleEmitter<SwipeNodeData>(
        "swipe",

        (data) => [
            quote(data.direction),

            String(data.distance),

            String(data.duration),
        ],
    );