import { useExecutionStore } from "../store/useExecutionStore";

export async function waitWhilePaused() {
  while (true) {
    const state = useExecutionStore.getState();

    if (state.isStopped) {
      throw new Error("Execution stopped");
    }

    if (!state.isPaused) {
      return;
    }

    await new Promise(resolve =>
      setTimeout(resolve, 100)
    );
  }
}