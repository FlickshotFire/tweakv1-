import { useDrawingStore } from "../lib/stores/useDrawingStore";
import { 
  Brush, 
  Eraser, 
  MousePointer2, 
  Undo2, 
  Redo2,
  Layers,
  Palette,
  Move3D,
  RotateCcw,
  FlipHorizontal,
  Scissors,
  Wand2
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function LeftToolbar() {
  const { 
    currentTool, 
    setCurrentTool, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    brushSize,
    brushOpacity
  } = useDrawingStore();

  const primaryTools = [
    { id: "brush", icon: Brush, label: "Brush", shortcut: "B" },
    { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
    { id: "select", icon: MousePointer2, label: "Selection", shortcut: "S" },
  ];

  const transformTools = [
    { id: "move", icon: Move3D, label: "Transform", shortcut: "T" },
    { id: "rotate", icon: RotateCcw, label: "Rotate", shortcut: "R" },
    { id: "flip", icon: FlipHorizontal, label: "Flip", shortcut: "F" },
  ];

  const utilityTools = [
    { id: "cut", icon: Scissors, label: "Cut", shortcut: "X" },
    { id: "magic", icon: Wand2, label: "Magic Wand", shortcut: "W" },
  ];

  const ToolButton = ({ tool, isActive, onClick }: any) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative
            ${isActive 
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
              : 'glass-panel text-white/70 hover:text-white hover:bg-white/10'
            }
          `}
        >
          <tool.icon className="w-5 h-5" />
          
          {/* Active indicator */}
          {isActive && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="glass-panel-dark text-white border-white/20">
        <div className="text-center">
          <div className="font-medium">{tool.label}</div>
          <div className="text-xs text-white/50 mt-1">{tool.shortcut}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="w-20 bg-premium-surface border-r border-premium relative">
      <div className="flex flex-col h-full">
        
        {/* Logo/Title */}
        <div className="h-16 flex items-center justify-center border-b border-premium">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brush className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Primary Tools */}
        <div className="p-4 space-y-3">
          <div className="text-xs font-medium text-premium-muted mb-2">Tools</div>
          {primaryTools.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              isActive={currentTool === tool.id}
              onClick={() => setCurrentTool(tool.id as any)}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="mx-4 h-px bg-premium-border" />

        {/* Transform Tools */}
        <div className="p-4 space-y-3">
          <div className="text-xs font-medium text-premium-muted mb-2">Transform</div>
          {transformTools.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              isActive={false}
              onClick={() => {/* TODO: Implement transform tools */}}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="mx-4 h-px bg-premium-border" />

        {/* Utility Tools */}
        <div className="p-4 space-y-3">
          <div className="text-xs font-medium text-premium-muted mb-2">Utility</div>
          {utilityTools.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              isActive={false}
              onClick={() => {/* TODO: Implement utility tools */}}
            />
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Quick Actions */}
        <div className="p-4 space-y-3 border-t border-premium">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={undo}
                disabled={!canUndo}
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                  ${canUndo 
                    ? 'glass-panel text-white/70 hover:text-white hover:bg-white/10' 
                    : 'glass-panel text-white/30 cursor-not-allowed'
                  }
                `}
              >
                <Undo2 className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="glass-panel-dark text-white border-white/20">
              <div className="text-center">
                <div className="font-medium">Undo</div>
                <div className="text-xs text-white/50 mt-1">⌘Z / 2 Fingers</div>
              </div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={redo}
                disabled={!canRedo}
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                  ${canRedo 
                    ? 'glass-panel text-white/70 hover:text-white hover:bg-white/10' 
                    : 'glass-panel text-white/30 cursor-not-allowed'
                  }
                `}
              >
                <Redo2 className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="glass-panel-dark text-white border-white/20">
              <div className="text-center">
                <div className="font-medium">Redo</div>
                <div className="text-xs text-white/50 mt-1">⌘Y</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Brush Preview */}
        <div className="p-4 border-t border-premium">
          <div className="text-xs font-medium text-premium-muted mb-2">Preview</div>
          <div className="w-12 h-12 glass-panel rounded-xl flex items-center justify-center">
            <div 
              className="rounded-full bg-white transition-all duration-200"
              style={{
                width: `${Math.max(4, Math.min(24, brushSize / 2))}px`,
                height: `${Math.max(4, Math.min(24, brushSize / 2))}px`,
                opacity: brushOpacity
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}