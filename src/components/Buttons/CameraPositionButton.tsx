import React from "react";
import { vec3, vec4 } from "gl-matrix";
import { CameraPositionButtonProps } from 'modules/ICamera';

const CameraPositionButton: React.FC<CameraPositionButtonProps> = ({ sceneView, savedPosition, onPositionSave }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (e.shiftKey) {
      const newPosition = {
        position: vec3.clone(sceneView.camera.position),
        rotation: vec4.clone(sceneView.camera.rotation),
      };
      onPositionSave(newPosition);
      return;
    }

    if (savedPosition) {
      sceneView.camera.controller.moveTo(
        savedPosition.position,
        savedPosition.rotation
      );
    }
  };

  return (
    <button onClick={handleClick}>
      {savedPosition ? "Go to Saved Position" : "Save position"}
    </button>
  );
};

export default CameraPositionButton;
