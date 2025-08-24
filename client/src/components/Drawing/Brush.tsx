import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useDrawingStore } from "../../lib/stores/useDrawingStore";

interface BrushProps {
  position: THREE.Vector3;
  visible?: boolean;
}

export default function Brush({ position, visible = true }: BrushProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { brushSize, brushColor, brushOpacity } = useDrawingStore();

  // Create brush material
  const material = useMemo(() => {
    const color = new THREE.Color(brushColor);
    return new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: brushOpacity * 0.5,
      side: THREE.DoubleSide,
    });
  }, [brushColor, brushOpacity]);

  // Animate brush cursor
  useFrame((state) => {
    if (meshRef.current && visible) {
      meshRef.current.position.copy(position);
      
      // Add subtle pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} material={material}>
      <circleGeometry args={[brushSize * 0.01, 16]} />
    </mesh>
  );
}
