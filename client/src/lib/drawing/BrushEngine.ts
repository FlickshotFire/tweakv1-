import { Stroke, StrokePoint, BrushSettings } from "../../types/drawing";

interface Point2D {
  x: number;
  y: number;
}

export class BrushEngine {
  private smoothingFactor = 0.1;
  private minDistance = 2;

  createStroke(id: string, settings: BrushSettings): Stroke {
    return {
      id,
      points: [],
      color: settings.color,
      size: settings.size,
      opacity: settings.opacity,
      layerId: settings.layerId,
      timestamp: Date.now(),
    };
  }

  addPoint2D(stroke: Stroke, position: Point2D, pressure: number = 1.0): void {
    // Skip points that are too close to the last point
    if (stroke.points.length > 0) {
      const lastPoint = stroke.points[stroke.points.length - 1];
      const distance = Math.sqrt(
        Math.pow(position.x - lastPoint.x, 2) + 
        Math.pow(position.y - lastPoint.y, 2)
      );
      if (distance < this.minDistance) {
        return;
      }
    }

    const point: StrokePoint = {
      x: position.x,
      y: position.y,
      pressure,
      timestamp: Date.now(),
    };

    // Apply smoothing for more natural strokes
    if (stroke.points.length > 1) {
      const smoothedPoint = this.smoothPoint(stroke.points, point);
      stroke.points.push(smoothedPoint);
    } else {
      stroke.points.push(point);
    }
  }

  // Keep the old 3D method for compatibility (if still needed elsewhere)
  addPoint(stroke: Stroke, position: { x: number; y: number; z?: number }, pressure: number = 1.0): void {
    this.addPoint2D(stroke, { x: position.x, y: position.y }, pressure);
  }

  private smoothPoint(previousPoints: StrokePoint[], newPoint: StrokePoint): StrokePoint {
    if (previousPoints.length < 2) {
      return newPoint;
    }

    const lastPoint = previousPoints[previousPoints.length - 1];
    const secondLastPoint = previousPoints[previousPoints.length - 2];

    // Calculate smoothed position using Bezier curve interpolation
    const smoothedX = lastPoint.x + (newPoint.x - secondLastPoint.x) * this.smoothingFactor;
    const smoothedY = lastPoint.y + (newPoint.y - secondLastPoint.y) * this.smoothingFactor;

    return {
      x: smoothedX,
      y: smoothedY,
      pressure: newPoint.pressure,
      timestamp: newPoint.timestamp,
    };
  }

  optimizeStroke(stroke: Stroke): Stroke {
    if (stroke.points.length <= 2) {
      return stroke;
    }

    // Simplify stroke by removing redundant points
    const optimizedPoints: StrokePoint[] = [stroke.points[0]];
    
    for (let i = 1; i < stroke.points.length - 1; i++) {
      const current = stroke.points[i];
      const previous = optimizedPoints[optimizedPoints.length - 1];
      const next = stroke.points[i + 1];

      // Check if the current point significantly changes the stroke direction
      const vec1 = { 
        x: current.x - previous.x, 
        y: current.y - previous.y 
      };
      const vec2 = { 
        x: next.x - current.x, 
        y: next.y - current.y 
      };
      
      // Normalize vectors
      const len1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
      const len2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
      
      if (len1 > 0) {
        vec1.x /= len1;
        vec1.y /= len1;
      }
      if (len2 > 0) {
        vec2.x /= len2;
        vec2.y /= len2;
      }
      
      const angle = vec1.x * vec2.x + vec1.y * vec2.y;
      
      // Keep points that change direction significantly or have different pressure
      if (angle < 0.95 || Math.abs(current.pressure - previous.pressure) > 0.1) {
        optimizedPoints.push(current);
      }
    }

    // Always keep the last point
    optimizedPoints.push(stroke.points[stroke.points.length - 1]);

    return {
      ...stroke,
      points: optimizedPoints,
    };
  }

  createBrushTexture(size: number = 64): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d')!;
    const center = size / 2;
    const radius = center * 0.8;
    
    // Create radial gradient for soft brush
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    return canvas;
  }
}
