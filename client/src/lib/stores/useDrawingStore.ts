import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Stroke, Layer, AnimationFrame } from "../../types/drawing";

export type DrawingTool = "brush" | "eraser" | "select";

interface DrawingState {
  // Current drawing state
  currentTool: DrawingTool;
  isDrawing: boolean;
  currentStroke: Stroke | null;
  
  // Brush settings
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
  
  // Strokes and layers
  strokes: Stroke[];
  layers: Layer[];
  activeLayerId: string;
  
  // Animation
  frames: AnimationFrame[];
  currentFrame: number;
  isPlaying: boolean;
  frameRate: number;
  
  // History for undo/redo
  history: Stroke[][];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  
  // Actions
  setCurrentTool: (tool: DrawingTool) => void;
  setIsDrawing: (drawing: boolean) => void;
  setCurrentStroke: (stroke: Stroke | null) => void;
  
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  
  addStroke: (stroke: Stroke) => void;
  removeStroke: (strokeId: string) => void;
  clearStrokes: () => void;
  clearCurrentStroke: () => void;
  
  setLayers: (layers: Layer[]) => void;
  setActiveLayer: (layerId: string) => void;
  
  setFrames: (frames: AnimationFrame[]) => void;
  setCurrentFrame: (frame: number | ((prev: number) => number)) => void;
  setIsPlaying: (playing: boolean) => void;
  setFrameRate: (rate: number) => void;
  
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

const initialLayer: Layer = {
  id: "layer_default",
  name: "Layer 1",
  visible: true,
  opacity: 1.0,
  strokes: [],
};

const initialFrame: AnimationFrame = {
  id: "frame_0",
  duration: 100,
  strokes: [],
};

export const useDrawingStore = create<DrawingState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentTool: "brush",
    isDrawing: false,
    currentStroke: null,
    
    brushColor: "#000000",
    brushSize: 5,
    brushOpacity: 1.0,
    
    strokes: [],
    layers: [initialLayer],
    activeLayerId: initialLayer.id,
    
    frames: [initialFrame],
    currentFrame: 0,
    isPlaying: false,
    frameRate: 12,
    
    history: [[]],
    historyIndex: 0,
    canUndo: false,
    canRedo: false,
    
    // Tool actions
    setCurrentTool: (tool) => set({ currentTool: tool }),
    setIsDrawing: (drawing) => set({ isDrawing: drawing }),
    setCurrentStroke: (stroke) => set({ currentStroke: stroke }),
    
    // Brush actions
    setBrushColor: (color) => set({ brushColor: color }),
    setBrushSize: (size) => set({ brushSize: Math.max(1, Math.min(50, size)) }),
    setBrushOpacity: (opacity) => set({ brushOpacity: Math.max(0, Math.min(1, opacity)) }),
    
    // Stroke actions
    addStroke: (stroke) => {
      set((state) => {
        const newStrokes = [...state.strokes, stroke];
        return { strokes: newStrokes };
      });
      get().saveToHistory();
    },
    
    removeStroke: (strokeId) => {
      set((state) => ({
        strokes: state.strokes.filter(stroke => stroke.id !== strokeId)
      }));
      get().saveToHistory();
    },
    
    clearStrokes: () => {
      set({ strokes: [] });
      get().saveToHistory();
    },
    
    clearCurrentStroke: () => set({ currentStroke: null }),
    
    // Layer actions
    setLayers: (layers) => set({ layers }),
    setActiveLayer: (layerId) => set({ activeLayerId: layerId }),
    
    // Animation actions
    setFrames: (frames) => set({ frames }),
    setCurrentFrame: (frame) => set((state) => ({ 
      currentFrame: typeof frame === 'function' ? frame(state.currentFrame) : frame 
    })),
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    setFrameRate: (rate) => set({ frameRate: Math.max(1, Math.min(60, rate)) }),
    
    // History actions
    saveToHistory: () => {
      set((state) => {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push([...state.strokes]);
        
        // Limit history size
        const maxHistory = 50;
        if (newHistory.length > maxHistory) {
          newHistory.splice(0, newHistory.length - maxHistory);
        }
        
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
          canUndo: newHistory.length > 1,
          canRedo: false,
        };
      });
    },
    
    undo: () => {
      set((state) => {
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          return {
            strokes: [...state.history[newIndex]],
            historyIndex: newIndex,
            canUndo: newIndex > 0,
            canRedo: true,
          };
        }
        return {};
      });
    },
    
    redo: () => {
      set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          return {
            strokes: [...state.history[newIndex]],
            historyIndex: newIndex,
            canUndo: true,
            canRedo: newIndex < state.history.length - 1,
          };
        }
        return {};
      });
    },
  }))
);
