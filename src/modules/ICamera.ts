import { View } from "@novorender/webgl-api";
import { CameraPosition } from "../types/CameraTypes";

export interface CameraPositionButtonProps {
  sceneView: View;
  savedPosition: CameraPosition | null;
  onPositionSave: (position: CameraPosition) => void;
}

export interface CameraPositionButtonsProps {
  sceneView: View;
}
