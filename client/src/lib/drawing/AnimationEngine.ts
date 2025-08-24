import { AnimationFrame, Layer, Stroke } from "../../types/drawing";

export class AnimationEngine {
  createFrame(): AnimationFrame {
    return {
      id: `frame_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      duration: 100, // Default 100ms per frame
      strokes: [],
    };
  }

  duplicateFrame(frame: AnimationFrame): AnimationFrame {
    return {
      ...frame,
      id: `frame_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      strokes: frame.strokes.map(stroke => ({
        ...stroke,
        id: `stroke_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      })),
    };
  }

  interpolateFrames(
    fromFrame: AnimationFrame,
    toFrame: AnimationFrame,
    steps: number
  ): AnimationFrame[] {
    const interpolatedFrames: AnimationFrame[] = [];

    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const interpolatedFrame = this.createFrame();
      
      // Simple interpolation - in a real implementation, this would be more sophisticated
      interpolatedFrame.strokes = this.interpolateStrokes(
        fromFrame.strokes,
        toFrame.strokes,
        t
      );
      
      interpolatedFrames.push(interpolatedFrame);
    }

    return interpolatedFrames;
  }

  private interpolateStrokes(
    fromStrokes: Stroke[],
    toStrokes: Stroke[],
    t: number
  ): Stroke[] {
    // For simplicity, we'll just fade between the strokes
    // In a real implementation, this would involve complex path interpolation
    const interpolatedStrokes: Stroke[] = [];

    // Add from strokes with decreasing opacity
    fromStrokes.forEach(stroke => {
      interpolatedStrokes.push({
        ...stroke,
        id: `interp_${stroke.id}_${t}`,
        opacity: stroke.opacity * (1 - t),
      });
    });

    // Add to strokes with increasing opacity
    toStrokes.forEach(stroke => {
      interpolatedStrokes.push({
        ...stroke,
        id: `interp_${stroke.id}_${t}`,
        opacity: stroke.opacity * t,
      });
    });

    return interpolatedStrokes;
  }

  generateOnionSkin(
    frames: AnimationFrame[],
    currentFrameIndex: number,
    onionSkinRange: number = 3
  ): Stroke[] {
    const onionSkinStrokes: Stroke[] = [];
    const start = Math.max(0, currentFrameIndex - onionSkinRange);
    const end = Math.min(frames.length, currentFrameIndex + onionSkinRange + 1);

    for (let i = start; i < end; i++) {
      if (i === currentFrameIndex) continue;

      const frame = frames[i];
      const distance = Math.abs(i - currentFrameIndex);
      const opacity = Math.max(0.1, 1 - (distance / onionSkinRange) * 0.8);
      
      frame.strokes.forEach(stroke => {
        onionSkinStrokes.push({
          ...stroke,
          id: `onion_${stroke.id}_${i}`,
          opacity: stroke.opacity * opacity,
          color: i < currentFrameIndex ? "#ff6b6b" : "#4ecdc4", // Red for previous, teal for next
        });
      });
    }

    return onionSkinStrokes;
  }

  optimizeAnimation(frames: AnimationFrame[]): AnimationFrame[] {
    // Remove empty frames and optimize stroke data
    return frames
      .filter(frame => frame.strokes.length > 0 || frames.indexOf(frame) === 0)
      .map(frame => ({
        ...frame,
        strokes: frame.strokes.filter(stroke => stroke.points.length > 1),
      }));
  }

  calculateAnimationDuration(frames: AnimationFrame[]): number {
    return frames.reduce((total, frame) => total + frame.duration, 0);
  }
}
