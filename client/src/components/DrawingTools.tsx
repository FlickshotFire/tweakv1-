import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useDrawingStore } from "../lib/stores/useDrawingStore";
import { Brush, Eraser, Move, Undo2, Redo2 } from "lucide-react";

export default function DrawingTools() {
  const { currentTool, setCurrentTool, undo, redo, canUndo, canRedo } = useDrawingStore();

  const tools = [
    { id: "brush", icon: Brush, label: "Brush Tool" },
    { id: "eraser", icon: Eraser, label: "Eraser Tool" },
    { id: "select", icon: Move, label: "Select Tool" },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={currentTool === tool.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTool(tool.id as any)}
                className="p-2"
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {tool.label}
            </TooltipContent>
          </Tooltip>
        ))}
        
        <div className="w-px h-6 bg-gray-600 mx-2" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="p-2"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Undo
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className="p-2"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Redo
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
