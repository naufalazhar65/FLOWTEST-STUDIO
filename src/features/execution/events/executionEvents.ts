export type ExecutionEvent =
  | {
      type: "node-started";
      nodeId: string;
    }
  | {
      type: "node-success";
      nodeId: string;
    }
  | {
      type: "node-failed";
      nodeId: string;
    }
  | {
      type: "execution-start";
    }
  | {
      type: "execution-finished";
    };