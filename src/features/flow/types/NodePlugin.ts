import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import type {
  FlowNodeData,
  NodeAction,
} from "./flowNode";

import type { NodeField } from "./nodeField";

export type NodeType = NodeAction;

type ElementGetterDefaults = {
  locatorStrategy: string;
  locator: string;
  variableName: string;
};

type DeviceGetterDefaults = {
  variableName: string;
};

export type NodeDefaults =
  | {
    action: "tap";
    locatorStrategy: string;
    locator: string;
  }
  | {
    action: "input";
    locatorStrategy: string;
    locator: string;
    text: string;
  }
  | {
    action: "assert";
    locatorStrategy: string;
    locator: string;
    expected: string;
  }
  | {
    action: "setVariable";
    variableName: string;
    value: string;
  }
  | {
    action: "delay";
    duration: number;
  }

  | {
    action: "swipe";
    direction:
    | "up"
    | "down"
    | "left"
    | "right";
    distance: number;
    duration: number;
  }
  | {
    action: "scroll";
    direction:
    | "up"
    | "down";
    amount: number;
  }

  | {
    action: "wait";

    locatorStrategy: string;

    locator: string;

    timeout: number;

    pollingInterval: number;
  }

  | {
    action: "launchApp";

    appPackage: string;

    appActivity: string;

    noReset: boolean;
  }

  | {
    action: "closeApp";

    appPackage: string;
  }
  | {
    action: "back";
  }
  | {
    action: "home";
  }
  | {
    action: "screenshot";

    fileName: string;
  }
  | {
    action: "if";

    condition: string;
  }
  | ({
    action: "getText";
  } & ElementGetterDefaults)

  | ({
    action: "elementExists";
  } & ElementGetterDefaults)

  | ({
    action: "getDisplayed";
  } & ElementGetterDefaults)

  | ({
    action: "getEnabled";
  } & ElementGetterDefaults)

  | ({
    action: "getSelected";
  } & ElementGetterDefaults)

  | ({
    action: "getAttribute";
    attribute: string;
  } & ElementGetterDefaults)

  | ({
    action: "getCurrentActivity";
  } & DeviceGetterDefaults)

  | ({
    action: "getCurrentPackage";
  } & DeviceGetterDefaults)

  | ({
    action: "getOrientation";
  } & DeviceGetterDefaults)

  | ({
    action: "getPlatformVersion";
  } & DeviceGetterDefaults)

  | ({
    action: "getDeviceName";
  } & DeviceGetterDefaults)

  | ({
    action: "getDeviceTime";
  } & DeviceGetterDefaults)
  | ({
    action: "getLocation";
  } & ElementGetterDefaults)
  | ({
    action: "getSize";
  } & ElementGetterDefaults)
  | ({
    action: "getRect";
  } & ElementGetterDefaults)


export interface NodeHandles {
  outputs: string[];
}

export interface NodePlugin {
  type: NodeType;

  title: string;

  subtitle: string;

  color: string;

  icon: LucideIcon;

  handles?: NodeHandles;

  defaults: NodeDefaults;

  fields: NodeField[];

  preview?: (
    data: FlowNodeData
  ) => ReactNode;
}

