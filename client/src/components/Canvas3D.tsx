import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import DrawingPlane from "./Drawing/DrawingPlane";
import StrokeRenderer from "./Drawing/StrokeRenderer";
import { useDrawing } from "../hooks/useDrawing";
import { useDrawingStore } from "../lib/stores/useDrawingStore";

export default function Canvas3D() {
  const { camera, gl, scene } = useThree();
  const { isDrawing, strokes, currentStroke } = useDrawingStore();
  const { startDrawing, updateDrawing, stopDrawing } = useDrawing();
  const sceneRef = useRef<THREE.Scene>(scene);

  // Handle mouse/touch input for drawing
  useEffect(() => {
    const canvas = gl.domElement;
    let isPressed = false;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: PointerEvent) => {
      isPressed = true;
      updateMousePosition(event);
      
      // Cast ray to find intersection with drawing plane
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const point = intersects[0].point;
        startDrawing(point);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isPressed || !isDrawing) return;
      
      updateMousePosition(event);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const point = intersects[0].point;
        updateDrawing(point);
      }
    };

    const handlePointerUp = () => {
      if (isPressed && isDrawing) {
        stopDrawing();
      }
      isPressed = false;
    };

    const updateMousePosition = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
    };
  }, [camera, gl, scene, isDrawing, startDrawing, updateDrawing, stopDrawing]);

  return (
    <>
      {/* 3D Grid for reference */}
      <gridHelper args={[20, 20, 0x444444, 0x444444]} />
      
      {/* Drawing planes at different depths */}
      <DrawingPlane position={[0, 0, 0]} />
      <DrawingPlane position={[0, 0, -2]} opacity={0.5} />
      <DrawingPlane position={[0, 0, -4]} opacity={0.3} />
      
      {/* Render all strokes */}
      <StrokeRenderer strokes={strokes} />
      
      {/* Render current stroke being drawn */}
      {currentStroke && (
        <StrokeRenderer strokes={[currentStroke]} />
      )}
      
      {/* Reference objects for 3D context */}
      <mesh position={[5, 1, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      
      <mesh position={[-5, 0.5, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </>
  );
}
