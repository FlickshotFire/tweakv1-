import { useState } from "react";
import { useAnimation } from "../hooks/useAnimation";
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Plus,
  Copy,
  Trash2,
  Settings,
  Clock,
  Layers
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function BottomTimeline() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFrames, setSelectedFrames] = useState<number[]>([]);
  
  const {
    frames,
    currentFrame,
    isPlaying,
    frameRate,
    playAnimation,
    pauseAnimation,
    stopAnimation,
    goToFrame,
    addFrame,
    deleteFrame,
    setFrameRate
  } = useAnimation();

  const handleFrameClick = (frameIndex: number, event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey) {
      // Multi-select with Cmd/Ctrl
      setSelectedFrames(prev => 
        prev.includes(frameIndex) 
          ? prev.filter(f => f !== frameIndex)
          : [...prev, frameIndex]
      );
    } else if (event.shiftKey && selectedFrames.length > 0) {
      // Range select with Shift
      const lastSelected = selectedFrames[selectedFrames.length - 1];
      const start = Math.min(lastSelected, frameIndex);
      const end = Math.max(lastSelected, frameIndex);
      setSelectedFrames(Array.from({ length: end - start + 1 }, (_, i) => start + i));
    } else {
      // Single select
      setSelectedFrames([frameIndex]);
      goToFrame(frameIndex);
    }
  };

  const duplicateSelectedFrames = () => {
    // TODO: Implement frame duplication
    console.log('Duplicate frames:', selectedFrames);
  };

  const deleteSelectedFrames = () => {
    if (selectedFrames.length > 0 && frames.length > 1) {
      selectedFrames.forEach(frameIndex => {
        if (frameIndex < frames.length) {
          deleteFrame(frameIndex);
        }
      });
      setSelectedFrames([]);
    }
  };

  return (
    <div className={`bg-premium-surface border-t border-premium transition-all duration-300 ${
      isExpanded ? 'h-48' : 'h-20'
    }`}>
      
      {/* Timeline Header */}
      <div className="h-20 flex items-center px-6 border-b border-premium">
        
        {/* Playback Controls */}
        <div className="flex items-center space-x-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToFrame(0)}
                className="premium-button text-white/70 hover:text-white"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              Go to Start
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={isPlaying ? pauseAnimation : playAnimation}
                className={`w-10 h-10 rounded-full ${
                  isPlaying 
                    ? 'premium-button-primary' 
                    : 'bg-green-500 hover:bg-green-600 text-white border-green-500/30'
                } transition-all duration-200`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              {isPlaying ? 'Pause' : 'Play'} (Space)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={stopAnimation}
                className="premium-button text-white/70 hover:text-white"
              >
                <Square className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              Stop
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToFrame(frames.length - 1)}
                className="premium-button text-white/70 hover:text-white"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              Go to End
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-8 bg-premium-border mx-4" />

        {/* Frame Info */}
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-white font-mono">
              {String(currentFrame + 1).padStart(3, '0')}
            </span>
            <span className="text-white/50"> / </span>
            <span className="text-white/70 font-mono">
              {String(frames.length).padStart(3, '0')}
            </span>
          </div>

          {/* Frame Rate */}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-white/50" />
            <span className="text-white/70 text-sm">{frameRate} FPS</span>
            <Slider
              value={[frameRate]}
              onValueChange={([value]) => setFrameRate(value)}
              min={1}
              max={60}
              step={1}
              className="w-20 premium-slider"
            />
          </div>
        </div>

        <div className="flex-1" />

        {/* Timeline Actions */}
        <div className="flex items-center space-x-2">
          {selectedFrames.length > 0 && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={duplicateSelectedFrames}
                    className="premium-button text-white/70 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="glass-panel-dark text-white border-white/20">
                  Duplicate Selected Frames
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={deleteSelectedFrames}
                    className="premium-button text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="glass-panel-dark text-white border-white/20">
                  Delete Selected Frames
                </TooltipContent>
              </Tooltip>

              <div className="w-px h-6 bg-premium-border mx-2" />
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={addFrame}
                className="premium-button-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Frame
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              Add New Frame
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="premium-button text-white/70 hover:text-white"
              >
                <Layers className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              {isExpanded ? 'Collapse' : 'Expand'} Timeline
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Timeline Frames */}
      {isExpanded && (
        <div className="h-28 p-4 overflow-x-auto">
          <div className="flex items-center space-x-2 h-full">
            {frames.map((frame, index) => (
              <div
                key={frame.id}
                className={`
                  flex-shrink-0 w-20 h-20 glass-panel rounded-xl cursor-pointer transition-all duration-200 border-2 relative
                  ${index === currentFrame 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                    : selectedFrames.includes(index)
                    ? 'border-yellow-500 shadow-lg shadow-yellow-500/25'
                    : 'border-white/10 hover:border-white/30'
                  }
                `}
                onClick={(e) => handleFrameClick(index, e)}
              >
                {/* Frame Preview */}
                <div className="w-full h-full rounded-lg bg-white/5 flex items-center justify-center">
                  <span className="text-white/70 text-xs font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Current Frame Indicator */}
                {index === currentFrame && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg" />
                )}

                {/* Selection Indicator */}
                {selectedFrames.includes(index) && index !== currentFrame && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full shadow-lg" />
                )}
              </div>
            ))}

            {/* Add Frame Button */}
            <button
              onClick={addFrame}
              className="flex-shrink-0 w-20 h-20 glass-panel rounded-xl border-2 border-dashed border-white/30 hover:border-white/50 transition-all duration-200 flex items-center justify-center"
            >
              <Plus className="w-6 h-6 text-white/50" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Timeline Scrubber */}
      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div 
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ 
              width: `${frames.length > 0 ? ((currentFrame + 1) / frames.length) * 100 : 0}%` 
            }}
          />
        </div>
      )}
    </div>
  );
}