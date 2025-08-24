import { useCallback } from "react";
import { useDrawingStore } from "../lib/stores/useDrawingStore";
import { BrushEngine } from "../lib/drawing/BrushEngine";

interface Point2D {
  x: number;
  y: number;
}

export function useDrawing() {
  const {
    isDrawing,
    currentStroke,
    brushColor,
    brushSize,
    brushOpacity,
    activeLayerId,
    setIsDrawing,
    setCurrentStroke,
    addStroke,
    clearCurrentStroke,
  } = useDrawingStore();

  const brushEngine = new BrushEngine();

  const startDrawing = useCallback((point: Point2D) => {
    if (isDrawing) return;

    const strokeId = `stroke_${Date.now()}_${Math.random()}`;
    const newStroke = brushEngine.createStroke(strokeId, {
      color: brushColor,
      size: brushSize,
      opacity: brushOpacity,
      layerId: activeLayerId,
    });

    brushEngine.addPoint2D(newStroke, point);
    setCurrentStroke(newStroke);
    setIsDrawing(true);
  }, [isDrawing, brushColor, brushSize, brushOpacity, activeLayerId, setCurrentStroke, setIsDrawing]);

  const updateDrawing = useCallback((point: Point2D) => {
    if (!isDrawing || !currentStroke) return;

    brushEngine.addPoint2D(currentStroke, point);
    setCurrentStroke({ ...currentStroke });
  }, [isDrawing, currentStroke, setCurrentStroke]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing || !currentStroke) return;

    // Finalize the stroke and add it to the strokes collection
    addStroke(currentStroke);
    clearCurrentStroke();
    setIsDrawing(false);
  }, [isDrawing, currentStroke, addStroke, clearCurrentStroke, setIsDrawing]);

  return {
    isDrawing,
    currentStroke,
    startDrawing,
    updateDrawing,
    stopDrawing,
  };
}
