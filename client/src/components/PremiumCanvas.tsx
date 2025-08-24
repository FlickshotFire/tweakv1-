import { useRef, useEffect, useCallback, useState } from "react";
import { useDrawing } from "../hooks/useDrawing";
import { useDrawingStore } from "../lib/stores/useDrawingStore";

export default function PremiumCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const { isDrawing, strokes, currentStroke, currentTool, brushSize } = useDrawingStore();
  const { startDrawing, updateDrawing, stopDrawing } = useDrawing();

  // Handle pointer events for drawing
  const handlePointerDown = useCallback((event: PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    
    startDrawing({ x, y });
  }, [startDrawing]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    
    updateDrawing({ x, y });
  }, [isDrawing, updateDrawing]);

  const handlePointerUp = useCallback((event: PointerEvent) => {
    if (isDrawing) {
      event.preventDefault();
      stopDrawing();
    }
  }, [isDrawing, stopDrawing]);

  // Two-finger tap for undo (Procreate style)
  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      // Two-finger tap - undo
      const { undo } = useDrawingStore.getState();
      undo();
    }
  }, []);

  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Pointer events for drawing
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerUp);

    // Touch events for gestures
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', (e) => e.preventDefault());
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, handleTouchStart]);

  // Render strokes to canvas with premium quality
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render all completed strokes
    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return;

      ctx.save();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = stroke.opacity;

      // Use smooth curves for premium quality
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length - 1; i++) {
        const current = stroke.points[i];
        const next = stroke.points[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      
      if (stroke.points.length > 1) {
        const lastPoint = stroke.points[stroke.points.length - 1];
        ctx.lineTo(lastPoint.x, lastPoint.y);
      }
      
      ctx.stroke();
      ctx.restore();
    });

    // Render current stroke being drawn
    if (currentStroke && currentStroke.points.length > 1) {
      ctx.save();
      ctx.strokeStyle = currentStroke.color;
      ctx.lineWidth = currentStroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = currentStroke.opacity;

      ctx.beginPath();
      ctx.moveTo(currentStroke.points[0].x, currentStroke.points[0].y);
      
      for (let i = 1; i < currentStroke.points.length - 1; i++) {
        const current = currentStroke.points[i];
        const next = currentStroke.points[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      
      if (currentStroke.points.length > 1) {
        const lastPoint = currentStroke.points[currentStroke.points.length - 1];
        ctx.lineTo(lastPoint.x, lastPoint.y);
      }
      
      ctx.stroke();
      ctx.restore();
    }
  }, [strokes, currentStroke]);

  // Handle canvas resize with high DPI support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set actual size in memory (scaled to account for extra pixel density)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Set display size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      // Scale the drawing context so everything draws at the correct size
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      setCanvasSize({ width: rect.width, height: rect.height });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Get cursor style based on current tool
  const getCursorClass = () => {
    switch (currentTool) {
      case 'brush':
        return 'canvas-cursor-brush';
      case 'eraser':
        return 'canvas-cursor-eraser';
      case 'select':
        return 'canvas-cursor-select';
      default:
        return 'canvas-cursor-brush';
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${getCursorClass()} gpu-accelerated`}
        style={{ 
          touchAction: 'none',
          width: '100%', 
          height: '100%'
        }}
      />
      
      {/* Brush Size Indicator */}
      {isDrawing && (
        <div 
          className="absolute pointer-events-none z-10 border-2 border-blue-400 rounded-full transition-all duration-100"
          style={{
            width: `${brushSize}px`,
            height: `${brushSize}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.6
          }}
        />
      )}
    </div>
  );
}