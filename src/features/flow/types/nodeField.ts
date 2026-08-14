import type {
  AssertNodeData,
  CloseAppNodeData,
  DelayNodeData,
  ElementExistsNodeData,
  GetAttributeNodeData,
  GetCurrentActivityNodeData,
  GetCurrentPackageNodeData,
  GetDeviceNameNodeData,
  GetDeviceTimeNodeData,
  GetDisplayedNodeData,
  GetEnabledNodeData,
  GetLocationNodeData,
  GetOrientationNodeData,
  GetPlatformVersionNodeData,
  GetRectNodeData,
  GetSelectedNodeData,
  GetSizeNodeData,
  GetTextNodeData,
  IfNodeData,
  InputNodeData,
  LaunchAppNodeData,
  ScrollNodeData,
  ScreenshotNodeData,
  SetVariableNodeData,
  SwipeNodeData,
  TapNodeData,
  WaitNodeData,
  LongPressNodeData,
  DoubleTapNodeData,
  DragNodeData,
  PinchNodeData,
  ZoomNodeData,
  FlingNodeData,
  HideKeyboardNodeData,
  BaseNodeData,
  RepeatNodeData
} from "./flowNode";

type EditableKeys<T> =
  Exclude<
    keyof T,
    keyof BaseNodeData
  >;

export type NodeFieldKey =
  | EditableKeys<TapNodeData>
  | EditableKeys<InputNodeData>
  | EditableKeys<AssertNodeData>
  | EditableKeys<SetVariableNodeData>
  | EditableKeys<DelayNodeData>
  | EditableKeys<SwipeNodeData>
  | EditableKeys<ScrollNodeData>
  | EditableKeys<WaitNodeData>
  | EditableKeys<LaunchAppNodeData>
  | EditableKeys<CloseAppNodeData>
  | EditableKeys<ScreenshotNodeData>
  | EditableKeys<IfNodeData>
  | EditableKeys<GetTextNodeData>
  | EditableKeys<ElementExistsNodeData>
  | EditableKeys<GetAttributeNodeData>
  | EditableKeys<GetCurrentActivityNodeData>
  | EditableKeys<GetCurrentPackageNodeData>
  | EditableKeys<GetOrientationNodeData>
  | EditableKeys<GetPlatformVersionNodeData>
  | EditableKeys<GetDeviceNameNodeData>
  | EditableKeys<GetDeviceTimeNodeData>
  | EditableKeys<GetDisplayedNodeData>
  | EditableKeys<GetEnabledNodeData>
  | EditableKeys<GetSelectedNodeData>
  | EditableKeys<GetLocationNodeData>
  | EditableKeys<GetSizeNodeData>
  | EditableKeys<GetRectNodeData>
  | EditableKeys<LongPressNodeData>
  | EditableKeys<DoubleTapNodeData>
  | EditableKeys<DragNodeData>
  | EditableKeys<PinchNodeData>
  | EditableKeys<ZoomNodeData>
  | EditableKeys<FlingNodeData>
  | EditableKeys<HideKeyboardNodeData>
  | EditableKeys<RepeatNodeData>;


export interface NodeField {
  key: NodeFieldKey;

  label: string;

  type:
  | "text"
  | "number"
  | "select"
  | "checkbox"
  | "textarea"
  | "fileName";

  placeholder?: string;

  options?: string[];

  min?: number;

  max?: number;

  step?: number;

  visibleWhen?: {
    platform?: "Android" | "iOS";
  };
}