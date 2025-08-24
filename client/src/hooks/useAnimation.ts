import { useCallback, useEffect } from "react";
import { useDrawingStore } from "../lib/stores/useDrawingStore";
import { AnimationEngine } from "../lib/drawing/AnimationEngine";

export function useAnimation() {
  const {
    frames,
    currentFrame,
    isPlaying,
    frameRate,
    setFrames,
    setCurrentFrame,
    setIsPlaying,
    setFrameRate,
  } = useDrawingStore();

  const animationEngine = new AnimationEngine();

  // Animation playback loop
  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev: number) => {
        const next = prev + 1;
        if (next >= frames.length) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length, frameRate, setCurrentFrame, setIsPlaying]);

  const playAnimation = useCallback(() => {
    if (frames.length > 1) {
      setIsPlaying(true);
    }
  }, [frames.length, setIsPlaying]);

  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const stopAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentFrame(0);
  }, [setIsPlaying, setCurrentFrame]);

  const goToFrame = useCallback((frameIndex: number) => {
    if (frameIndex >= 0 && frameIndex < frames.length) {
      setCurrentFrame(frameIndex);
    }
  }, [frames.length, setCurrentFrame]);

  const addFrame = useCallback(() => {
    const newFrame = animationEngine.createFrame();
    const updatedFrames = [...frames, newFrame];
    setFrames(updatedFrames);
    setCurrentFrame(updatedFrames.length - 1);
  }, [frames, setFrames, setCurrentFrame]);

  const deleteFrame = useCallback((frameIndex: number) => {
    if (frames.length <= 1) return; // Don't delete the last frame
    
    const updatedFrames = frames.filter((_, index) => index !== frameIndex);
    setFrames(updatedFrames);
    
    // Adjust current frame if necessary
    if (currentFrame >= updatedFrames.length) {
      setCurrentFrame(updatedFrames.length - 1);
    }
  }, [frames, currentFrame, setFrames, setCurrentFrame]);

  const duplicateFrame = useCallback((frameIndex: number) => {
    const frameToDuplicate = frames[frameIndex];
    if (frameToDuplicate) {
      const duplicatedFrame = animationEngine.duplicateFrame(frameToDuplicate);
      const updatedFrames = [
        ...frames.slice(0, frameIndex + 1),
        duplicatedFrame,
        ...frames.slice(frameIndex + 1)
      ];
      setFrames(updatedFrames);
    }
  }, [frames, setFrames]);

  return {
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
    duplicateFrame,
    setFrameRate,
  };
}
