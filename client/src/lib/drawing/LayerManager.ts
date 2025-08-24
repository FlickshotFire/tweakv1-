import { Layer, Stroke } from "../../types/drawing";

export class LayerManager {
  createLayer(name: string): Layer {
    return {
      id: `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      visible: true,
      opacity: 1.0,
      strokes: [],
    };
  }

  duplicateLayer(layer: Layer): Layer {
    return {
      ...layer,
      id: `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${layer.name} Copy`,
      strokes: [...layer.strokes],
    };
  }

  mergeLayersDown(layers: Layer[], targetLayerIndex: number): Layer[] {
    if (targetLayerIndex <= 0 || targetLayerIndex >= layers.length) {
      return layers;
    }

    const targetLayer = layers[targetLayerIndex];
    const belowLayer = layers[targetLayerIndex - 1];

    // Merge strokes from target layer into the layer below
    const mergedLayer: Layer = {
      ...belowLayer,
      strokes: [...belowLayer.strokes, ...targetLayer.strokes],
    };

    // Remove target layer and replace below layer with merged layer
    const newLayers = [...layers];
    newLayers[targetLayerIndex - 1] = mergedLayer;
    newLayers.splice(targetLayerIndex, 1);

    return newLayers;
  }

  getVisibleLayers(layers: Layer[]): Layer[] {
    return layers.filter(layer => layer.visible);
  }

  getLayerByStroke(layers: Layer[], strokeId: string): Layer | null {
    for (const layer of layers) {
      if (layer.strokes.some(stroke => stroke.id === strokeId)) {
        return layer;
      }
    }
    return null;
  }

  moveStrokeBetweenLayers(
    layers: Layer[],
    strokeId: string,
    fromLayerId: string,
    toLayerId: string
  ): Layer[] {
    const fromLayer = layers.find(layer => layer.id === fromLayerId);
    const toLayer = layers.find(layer => layer.id === toLayerId);

    if (!fromLayer || !toLayer) {
      return layers;
    }

    const stroke = fromLayer.strokes.find(s => s.id === strokeId);
    if (!stroke) {
      return layers;
    }

    return layers.map(layer => {
      if (layer.id === fromLayerId) {
        return {
          ...layer,
          strokes: layer.strokes.filter(s => s.id !== strokeId),
        };
      }
      if (layer.id === toLayerId) {
        return {
          ...layer,
          strokes: [...layer.strokes, { ...stroke, layerId: toLayerId }],
        };
      }
      return layer;
    });
  }

  optimizeLayers(layers: Layer[]): Layer[] {
    return layers.map(layer => ({
      ...layer,
      strokes: layer.strokes.filter(stroke => stroke.points.length > 1),
    }));
  }
}
