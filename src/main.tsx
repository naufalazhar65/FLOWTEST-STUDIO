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
    document.getElementById("root")!
  ).render(
    <StrictMode>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <App />
      </div>
    </StrictMode>
  );
}

void bootstrap();