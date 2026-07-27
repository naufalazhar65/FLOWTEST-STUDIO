export class ExecutionTimer {
  private started = performance.now();

  stop() {
    return performance.now() - this.started;
  }
}