import * as THREE from "three";
import { Stroke, Layer } from "../../types/drawing";

export interface ExportResult {
  url: string;
  filename: string;
  mimeType: string;
}

export class ExportManager {
  async exportAsPNG(strokes: Stroke[], layers: Layer[]): Promise<ExportResult> {
    const canvas = this.createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d')!;
    
    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render each visible layer
    const visibleLayers = layers.filter(layer => layer.visible);
    for (const layer of visibleLayers) {
      await this.renderLayerToCanvas(ctx, layer, strokes);
    }
    
    const blob = await this.canvasToBlob(canvas, 'image/png');
    const url = URL.createObjectURL(blob);
    
    return {
      url,
      filename: `drawing_${new Date().toISOString().split('T')[0]}.png`,
      mimeType: 'image/png',
    };
  }

  async exportAsSVG(strokes: Stroke[], layers: Layer[]): Promise<ExportResult> {
    const width = 1920;
    const height = 1080;
    
    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    
    const visibleLayers = layers.filter(layer => layer.visible);
    for (const layer of visibleLayers) {
      svgContent += `<g opacity="${layer.opacity}">`;
      
      const layerStrokes = strokes.filter(stroke => stroke.layerId === layer.id);
      for (const stroke of layerStrokes) {
        if (stroke.points.length < 2) continue;
        
        let path = `M ${stroke.points[0].x} ${stroke.points[0].y}`;
        for (let i = 1; i < stroke.points.length; i++) {
          path += ` L ${stroke.points[i].x} ${stroke.points[i].y}`;
        }
        
        svgContent += `<path d="${path}" stroke="${stroke.color}" stroke-width="${stroke.size}" stroke-opacity="${stroke.opacity}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      
      svgContent += '</g>';
    }
    
    svgContent += '</svg>';
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    return {
      url,
      filename: `drawing_${new Date().toISOString().split('T')[0]}.svg`,
      mimeType: 'image/svg+xml',
    };
  }

  async exportAsGIF(strokes: Stroke[], layers: Layer[]): Promise<ExportResult> {
    // For demonstration - in a real implementation, you'd use a GIF encoder library
    console.log("GIF export would render animation frames and encode as GIF");
    
    // Fallback to PNG for now
    return this.exportAsPNG(strokes, layers);
  }

  async exportAsMP4(strokes: Stroke[], layers: Layer[]): Promise<ExportResult> {
    // For demonstration - in a real implementation, you'd use WebCodecs or similar
    console.log("MP4 export would render animation frames and encode as video");
    
    // Fallback to PNG for now
    return this.exportAsPNG(strokes, layers);
  }

  async exportAsJSON(strokes: Stroke[], layers: Layer[]): Promise<ExportResult> {
    const exportData = {
      version: "1.0",
      timestamp: Date.now(),
      strokes: strokes.map(stroke => ({
        ...stroke,
        points: stroke.points.map(p => ({
          x: parseFloat(p.x.toFixed(3)),
          y: parseFloat(p.y.toFixed(3)),
          pressure: parseFloat(p.pressure.toFixed(3)),
          timestamp: p.timestamp,
        })),
      })),
      layers: layers,
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    return {
      url,
      filename: `drawing_${new Date().toISOString().split('T')[0]}.json`,
      mimeType: 'application/json',
    };
  }

  private createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  private async renderLayerToCanvas(
    ctx: CanvasRenderingContext2D,
    layer: Layer,
    allStrokes: Stroke[]
  ): Promise<void> {
    ctx.globalAlpha = layer.opacity;
    
    const layerStrokes = allStrokes.filter(stroke => stroke.layerId === layer.id);
    
    for (const stroke of layerStrokes) {
      if (stroke.points.length < 2) continue;
      
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = layer.opacity * stroke.opacity;
      
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1; // Reset
  }

  private async canvasToBlob(canvas: HTMLCanvasElement, mimeType: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, mimeType);
    });
  }
}
