import type { ExecutionEvent } from "./executionEvents";

type Listener = (
  event: ExecutionEvent
) => void;

const listeners = new Set<Listener>();

export function subscribeExecution(
  listener: Listener
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function emitExecution(
  event: ExecutionEvent
) {
  listeners.forEach((listener) =>
    listener(event)
  );
}