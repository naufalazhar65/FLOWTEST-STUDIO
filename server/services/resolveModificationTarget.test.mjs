import { describe, expect, it } from "vitest";

import {
  resolveModificationTarget,
  findAmbiguousModificationTargets,
  resolveNodeTarget,
} from "./resolveModificationTarget.mjs";

function createNode({
  id,
  title,
  action = title.toLowerCase(),
  locator = null,
}) {
  return {
    id,
    title,
    subtitle: title,
    action,
    locator,
    details: {},
  };
}

function createContext({ nodes, edges, selectedNodeId = null }) {
  return {
    nodes,
    edges,
    selectedNodeId,
  };
}

function operation(type, targetNodeId = "model-target") {
  return {
    type,
    targetNodeId,
    step: {
      action: type === "updateNode" ? "assert" : "wait",
    },
  };
}

describe("resolveModificationTarget", () => {
  it("resolves the selected node", () => {
    const nodes = [
      createNode({
        id: "get-text",
        title: "Get Text",
        action: "getText",
      }),
      createNode({
        id: "assert",
        title: "Assert",
        action: "assert",
      }),
    ];

    const edges = [
      {
        id: "edge-1",
        source: "get-text",
        target: "assert",
        type: "flow",
      },
    ];

    const context = createContext({
      nodes,
      edges,
      selectedNodeId: "get-text",
    });

    const result = resolveModificationTarget({
      operation: operation("addNodeBefore"),
      context,
      message: "Tambahkan wait sebelum node yang dipilih",
    });

    expect(result).toBe("get-text");
  });

  it("resolves the assertion after the selected node", () => {
    const nodes = [
      createNode({
        id: "get-text",
        title: "Get Text",
        action: "getText",
      }),
      createNode({
        id: "assert",
        title: "Assert",
        action: "assert",
      }),
    ];

    const edges = [
      {
        id: "edge-1",
        source: "get-text",
        target: "assert",
        type: "flow",
      },
    ];

    const context = createContext({
      nodes,
      edges,
      selectedNodeId: "get-text",
    });

    const result = resolveModificationTarget({
      operation: operation("updateNode"),
      context,
      message:
        "Ubah assertion setelah node yang dipilih menjadi contains Dashboard",
    });

    expect(result).toBe("assert");
  });

  it("resolves an explicit node reference without selecting a node", () => {
    const nodes = [
      createNode({
        id: "login",
        title: "Login",
        action: "tap",
      }),
      createNode({
        id: "assert",
        title: "Assert",
        action: "assert",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result = resolveModificationTarget({
      operation: operation("addNodeBefore"),
      context,
      message: "Tambahkan wait sebelum Login",
    });

    expect(result).toBe("login");
  });

  it("resolves the node after an explicit reference", () => {
    const nodes = [
      createNode({
        id: "tap",
        title: "Tap",
        action: "tap",
      }),
      createNode({
        id: "wait",
        title: "Wait",
        action: "wait",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [
        {
          id: "edge-1",
          source: "tap",
          target: "wait",
          type: "flow",
        },
      ],
    });

    const result = resolveModificationTarget({
      operation: operation("addNodeAfter"),
      context,
      message: "Tambahkan delay setelah Tap",
    });

    expect(result).toBe("tap");
  });

  it("resolves the first duplicate reference", () => {
    const nodes = [
      createNode({
        id: "login-1",
        title: "Login",
        action: "tap",
      }),
      createNode({
        id: "login-2",
        title: "Login",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result = resolveModificationTarget({
      operation: operation("addNodeBefore", "login-1"),
      context,
      message: "Tambahkan wait sebelum Login pertama",
    });

    expect(result).toBe("login-1");
  });

  it("resolves the second duplicate reference", () => {
    const nodes = [
      createNode({
        id: "login-1",
        title: "Login",
        action: "tap",
      }),
      createNode({
        id: "login-2",
        title: "Login",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result = resolveModificationTarget({
      operation: operation("addNodeBefore", "login-2"),
      context,
      message: "Tambahkan wait sebelum Login kedua",
    });

    expect(result).toBe("login-2");
  });

  it("resolves the last duplicate reference", () => {
    const nodes = [
      createNode({
        id: "login-1",
        title: "Login",
        action: "tap",
      }),
      createNode({
        id: "login-2",
        title: "Login",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result = resolveModificationTarget({
      operation: operation("addNodeBefore"),
      context,
      message: "Tambahkan wait sebelum Login terakhir",
    });

    expect(result).toBe("login-2");
  });

  it("returns null for an ambiguous reference", () => {
    const nodes = [
      createNode({
        id: "login-1",
        title: "Login",
        action: "tap",
      }),
      createNode({
        id: "login-2",
        title: "Login",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result = resolveModificationTarget({
      operation: operation("addNodeBefore"),
      context,
      message: "Tambahkan wait sebelum Login",
    });

    expect(result).toBeNull();
  });

  it("resolves a reference using graph context", () => {
    const nodes = [
      createNode({
        id: "get-text",
        title: "Get Text",
        action: "getText",
      }),
      createNode({
        id: "login-1",
        title: "Login",
        action: "tap",
      }),
      createNode({
        id: "assert",
        title: "Assert",
        action: "assert",
      }),
    ];

    const edges = [
      {
        id: "edge-1",
        source: "get-text",
        target: "login-1",
        type: "flow",
      },
      {
        id: "edge-2",
        source: "login-1",
        target: "assert",
        type: "flow",
      },
    ];

    const context = createContext({
      nodes,
      edges,
    });

    const result = resolveModificationTarget({
      operation: operation("addNodeBefore"),
      context,
      message: "Tambahkan wait sebelum Login setelah Get Text",
    });

    expect(result).toBe("login-1");
  });

  it("resolves deleteNode using an explicit node reference", () => {
    const nodes = [
      createNode({
        id: "return",
        title: "Press Return",
        action: "pressReturn",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result = resolveModificationTarget({
      operation: operation("deleteNode"),
      context,
      message: "Hapus Press Return",
    });

    expect(result).toBe("return");
  });

  it("returns ambiguous candidates for duplicate node references", () => {
    const nodes = [
      createNode({
        id: "login-1",
        title: "Login",
        action: "tap",
      }),
      createNode({
        id: "login-2",
        title: "Login",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result = findAmbiguousModificationTargets({
      context,
      message: "Tambahkan wait sebelum Login",
    });

    expect(result).toHaveLength(2);

    expect(result.map((candidate) => candidate.nodeId)).toEqual([
      "login-1",
      "login-2",
    ]);
  });

  it("does not return ambiguity for an explicit ordinal reference", () => {
    const nodes = [
      createNode({
        id: "login-1",
        title: "Login",
        action: "tap",
      }),
      createNode({
        id: "login-2",
        title: "Login",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result = findAmbiguousModificationTargets({
      context,
      message: "Tambahkan wait sebelum Login kedua",
    });

    expect(result).toEqual([]);
  });

    it("resolves a node from a failure question", () => {
    const nodes = [
      createNode({
        id: "login-screen",
        title: "Login Screen",
        action: "tap",
      }),
      createNode({
        id: "menu",
        title: "Menu",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result =
      resolveNodeTarget({
        context,
        message:
          "Kenapa node Login Screen gagal?",
      });

    expect(
      result.status,
    ).toBe(
      "resolved",
    );

    expect(
      result.targetNodeId,
    ).toBe(
      "login-screen",
    );
  });

  it("resolves the second duplicate node from a failure question", () => {
    const nodes = [
      createNode({
        id: "product-a-1",
        title: "Product A",
        action: "tap",
      }),
      createNode({
        id: "product-a-2",
        title: "Product A",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result =
      resolveNodeTarget({
        context,
        message:
          "Kenapa Product A yang kedua gagal?",
      });

    expect(
      result.status,
    ).toBe(
      "resolved",
    );

    expect(
      result.targetNodeId,
    ).toBe(
      "product-a-2",
    );
  });

  it("resolves the last duplicate node from a failure question", () => {
    const nodes = [
      createNode({
        id: "product-a-1",
        title: "Product A",
        action: "tap",
      }),
      createNode({
        id: "product-a-2",
        title: "Product A",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result =
      resolveNodeTarget({
        context,
        message:
          "Kenapa Product A terakhir gagal?",
      });

    expect(
      result.status,
    ).toBe(
      "resolved",
    );

    expect(
      result.targetNodeId,
    ).toBe(
      "product-a-2",
    );
  });

  it("returns ambiguous for duplicate nodes without an ordinal", () => {
    const nodes = [
      createNode({
        id: "product-a-1",
        title: "Product A",
        action: "tap",
      }),
      createNode({
        id: "product-a-2",
        title: "Product A",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result =
      resolveNodeTarget({
        context,
        message:
          "Kenapa Product A gagal?",
      });

    expect(
      result.status,
    ).toBe(
      "ambiguous",
    );

    if (
      result.status ===
      "ambiguous"
    ) {
      expect(
        result.candidates.map(
          (
            candidate,
          ) =>
            candidate.nodeId,
        ),
      ).toEqual([
        "product-a-1",
        "product-a-2",
      ]);
    }
  });

  it("returns notFound when the requested node does not exist", () => {
    const nodes = [
      createNode({
        id: "login",
        title: "Login",
        action: "tap",
      }),
    ];

    const context = createContext({
      nodes,
      edges: [],
    });

    const result =
      resolveNodeTarget({
        context,
        message:
          "Kenapa Checkout gagal?",
      });

    expect(
      result.status,
    ).toBe(
      "notFound",
    );
  });

  it(
  "prefers semantic target over a conflicting locator",
  () => {
    const nodes = [
      {
        ...createNode({
          id: "login-screen",
          title: "Login",
          action: "tap",
          locator: "Login",
        }),

        details: {
          semanticTarget:
            "login-screen",
        },
      },

      {
        ...createNode({
          id: "login-button",
          title: "Login",
          action: "tap",
          locator: "Login",
        }),

        details: {
          semanticTarget:
            "login-button",
        },
      },
    ];

    const context =
      createContext({
        nodes,
        edges: [],
      });

    const result =
      resolveModificationTarget({
        operation:
          operation(
            "updateNode",
          ),
        context,
        message:
          "Ubah Login Screen menjadi wait",
      });

    expect(result).toBe(
      "login-screen",
    );
  },
);

it(
  "does not resolve to the first next node when the requested target is another node",
  () => {
    const nodes = [
      createNode({
        id: "selected",
        title: "Get Text",
        action: "getText",
      }),

      createNode({
        id: "first-next",
        title: "Delay",
        action: "delay",
      }),

      createNode({
        id: "requested-next",
        title: "Login",
        action: "tap",
      }),
    ];

    const edges = [
      {
        id: "edge-1",
        source: "selected",
        target: "first-next",
        type: "flow",
      },
      {
        id: "edge-2",
        source: "first-next",
        target: "requested-next",
        type: "flow",
      },
    ];

    const context = createContext({
      nodes,
      edges,
      selectedNodeId:
        "selected",
    });

    const result =
      resolveModificationTarget({
        operation:
          operation(
            "addNodeBefore",
          ),

        context,

        message:
          "Tambahkan wait sebelum Login setelah node yang dipilih",
      });

    expect(result).toBe(
      "requested-next",
    );
  },
);

it(
  "accepts an explicit targetNodeId when it matches an ambiguous reference candidate",
  () => {
    const nodes = [
      createNode({
        id: "login-1",
        title: "Login",
        action: "tap",
      }),

      createNode({
        id: "login-2",
        title: "Login",
        action: "tap",
      }),
    ];

    const context =
      createContext({
        nodes,
        edges: [],
      });

    const result =
      resolveModificationTarget({
        operation:
          operation(
            "addNodeBefore",
            "login-2",
          ),

        context,

        message:
          "Tambahkan wait sebelum Login",
      });

    expect(result).toBe(
      "login-2",
    );
  },
);

it(
  "does not trust an explicit targetNodeId outside the ambiguous reference candidates",
  () => {
    const nodes = [
      createNode({
        id: "login-1",
        title: "Login",
        action: "tap",
      }),

      createNode({
        id: "login-2",
        title: "Login",
        action: "tap",
      }),

      createNode({
        id: "logout",
        title: "Logout",
        action: "tap",
      }),
    ];

    const context =
      createContext({
        nodes,
        edges: [],
      });

    const result =
      resolveModificationTarget({
        operation:
          operation(
            "addNodeBefore",
            "logout",
          ),

        context,

        message:
          "Tambahkan wait sebelum Login",
      });

    expect(result).toBeNull();
  },
);
});
