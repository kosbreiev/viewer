import React, { useState } from "react";
import CameraPositionButton from './CameraPositionButton';
import { CameraPositionButtonsProps } from 'modules/ICamera';
import { CameraPosition } from 'types/CameraTypes';

const CameraPositionButtons: React.FC<CameraPositionButtonsProps> = ({ sceneView }) => {
  const [positions, setPositions] = useState<(CameraPosition | null)[]>([null, null, null]);

  const handlePositionSave = (index: number) => (position: CameraPosition) => {
    const newPositions = [...positions];
    newPositions[index] = position;
    setPositions(newPositions);
  };

  return (
    <div>
      {positions.map((savedPosition, index) => (
        <CameraPositionButton 
          key={index} 
          sceneView={sceneView} 
          savedPosition={savedPosition} 
          onPositionSave={handlePositionSave(index)} 
        />
      ))}
    </div>
  );
};

export default CameraPositionButtons;
