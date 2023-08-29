import React, { useEffect, useCallback, useState } from 'react';
import './Renderer.css';
import { run, dataApi, api } from "../../api/NovorenderApi";
import { View, Scene, OrthoControllerParams } from "@novorender/webgl-api";
import Button from '../Buttons/CameraPositionButtons';
import Search from '../Search/Search';

export default function Canvas() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [error, setError] = useState<string>('');

  const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
    if (node) {
      setCanvas(node);
    }
  }, []);

  const loadSceneAndCreateView = async () => {
    const sceneData = await dataApi.loadScene(`${process.env.SCENE_ID}`);
    if ("error" in sceneData) {
      throw new Error("Failed to load the scene");
    }

    const { url, db, settings, camera: cameraParams } = sceneData;
    const loadedScene = await api.loadScene(url, db);
    const createdView = await api.createView(settings, canvas!);

    createdView.applySettings({ quality: { resolution: { value: 1 } } });
    const camera = cameraParams || { kind: "flight" };
    createdView.camera.controller = api.createCameraController(camera as OrthoControllerParams, canvas!);
    createdView.scene = loadedScene;

    return { createdView, loadedScene };
  }

  useEffect(() => {
    if (!canvas) return;

    async function initializeView() {
      try {
        const { createdView, loadedScene } = await loadSceneAndCreateView();
        setView(createdView);
        setScene(loadedScene);
        if (canvas) {
          run(createdView, canvas);
        }
        
      } catch (e) {
        console.error(e);
        setError('Oops! Something went wrong.');
      }
    }

    initializeView();
  }, [canvas]);

  return (
    <>
      <div className='button-container'>
        {view && (
          <>
         <Button sceneView={view} />
         <Search view={view} scene={scene!} />
          </>
        )}
      </div>
      {error && <div className='error'>{error}</div>}
      <canvas ref={canvasRef} tabIndex={-1} />
    </>
  );
}
