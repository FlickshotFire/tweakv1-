export interface StrokePoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

export interface Stroke {
  id: string;
  points: StrokePoint[];
  color: string;
  size: number;
  opacity: number;
  layerId: string;
  timestamp: number;
}

export interface BrushSettings {
  color: string;
  size: number;
  opacity: number;
  layerId: string;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  strokes: Stroke[];
}

export interface AnimationFrame {
  id: string;
  duration: number; // Duration in milliseconds
  strokes: Stroke[];
}

export interface DrawingProject {
  id: string;
  name: string;
  created: number;
  modified: number;
  layers: Layer[];
  frames: AnimationFrame[];
  settings: {
    canvasSize: {
      width: number;
      height: number;
    };
    backgroundColor: string;
    frameRate: number;
  };
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  settings: Record<string, any>;
}

export interface ViewportSettings {
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
}
