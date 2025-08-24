import { useMemo } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { Stroke } from "../../types/drawing";

interface StrokeRendererProps {
  strokes: Stroke[];
}

export default function StrokeRenderer({ strokes }: StrokeRendererProps) {
  const strokeLines = useMemo(() => {
    return strokes.map((stroke) => {
      const points = stroke.points.map(p => [p.x, p.y, 0]) as [number, number, number][];
      
      return {
        id: stroke.id,
        points,
        color: stroke.color,
        lineWidth: stroke.size,
        opacity: stroke.opacity,
      };
    });
  }, [strokes]);

  return (
    <>
      {strokeLines.map((line) => (
        <Line
          key={line.id}
          points={line.points}
          color={line.color}
          lineWidth={line.lineWidth}
          transparent
          opacity={line.opacity}
        />
      ))}
    </>
  );
}
