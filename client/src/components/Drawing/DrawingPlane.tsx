import { useMemo } from "react";
import * as THREE from "three";

interface DrawingPlaneProps {
  position?: [number, number, number];
  size?: [number, number];
  opacity?: number;
}

export default function DrawingPlane({ 
  position = [0, 0, 0], 
  size = [20, 20], 
  opacity = 0.1 
}: DrawingPlaneProps) {
  
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
    });
  }, [opacity]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} material={material}>
      <planeGeometry args={size} />
    </mesh>
  );
}
