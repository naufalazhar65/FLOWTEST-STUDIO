import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import type {
  AssertOperator,
  FlowNodeData,
  NodeAction,
} from "./flowNode";

import type { NodeField } from "./nodeField";
import type { LocatorStrategy } from "../../execution/types/LocatorStrategy";

export type NodeType = NodeAction;

type ElementGetterDefaults = {
  locatorStrategy: LocatorStrategy;
  locator: string;
  variableName: string;
};

type DeviceGetterDefaults = {
  variableName: string;
};

export type NodeDefaults =
  | {
    action: "tap";
    locatorStrategy: LocatorStrategy;
    locator: string;
  }
  | {
    action: "input";
    locatorStrategy: LocatorStrategy;
    locator: string;
    text: string;
  }
  | {
    action: "assert";
    actual: string;
    expected: string;
    operator: AssertOperator;
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

    locatorStrategy: LocatorStrategy;

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

    actual: string;

    expected: string;

    operator: AssertOperator;
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

