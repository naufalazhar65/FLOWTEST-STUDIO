import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import "./features/command";

import {
  runRecentProjectsMigration,
} from "./features/project/services/runRecentProjectsMigration";

async function bootstrap() {
  await runRecentProjectsMigration();

  createRoot(
    document.getElementById("root")!,
  ).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();