import { useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useAnimation } from "../hooks/useAnimation";
import { Play, Pause, Square, SkipBack, SkipForward, Plus } from "lucide-react";

export default function AnimationTimeline() {
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

  const [selectedFrames, setSelectedFrames] = useState<number[]>([]);

  const handleFrameClick = (frameIndex: number) => {
    if (selectedFrames.includes(frameIndex)) {
      setSelectedFrames(selectedFrames.filter(f => f !== frameIndex));
    } else {
      setSelectedFrames([...selectedFrames, frameIndex]);
    }
    goToFrame(frameIndex);
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      {/* Timeline Controls */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={isPlaying ? pauseAnimation : playAnimation}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button variant="outline" size="sm" onClick={stopAnimation}>
            <Square className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToFrame(Math.max(0, currentFrame - 1))}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToFrame(Math.min(frames.length - 1, currentFrame + 1))}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={addFrame}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Frame:</span>
            <span className="text-sm font-mono">
              {currentFrame + 1} / {frames.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm">FPS:</span>
            <div className="w-20">
              <Slider
                value={[frameRate]}
                onValueChange={([value]) => setFrameRate(value)}
                min={1}
                max={60}
                step={1}
              />
            </div>
            <span className="text-sm font-mono w-8">{frameRate}</span>
          </div>
        </div>
      </div>

      {/* Timeline Frames */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex items-center h-full p-2 space-x-1">
          {frames.map((frame, index) => (
            <div
              key={frame.id}
              className={`flex-shrink-0 w-16 h-16 border-2 cursor-pointer rounded transition-all ${
                index === currentFrame
                  ? "border-blue-500 bg-blue-900"
                  : selectedFrames.includes(index)
                  ? "border-yellow-500 bg-yellow-900"
                  : "border-gray-600 bg-gray-800 hover:border-gray-500"
              }`}
              onClick={() => handleFrameClick(index)}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs font-mono">{index + 1}</span>
              </div>
            </div>
          ))}
          
          {/* Add frame button */}
          <div
            className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-600 cursor-pointer rounded hover:border-gray-500 flex items-center justify-center"
            onClick={addFrame}
          >
            <Plus className="w-6 h-6 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Frame info */}
      <div className="p-2 border-t border-gray-700 text-xs text-gray-400">
        Duration: {(frames.length / frameRate).toFixed(2)}s
        {selectedFrames.length > 0 && (
          <span className="ml-4">
            Selected: {selectedFrames.length} frame{selectedFrames.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
