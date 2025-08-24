import { useCallback } from "react";
import { useDrawingStore } from "../lib/stores/useDrawingStore";
import { LayerManager } from "../lib/drawing/LayerManager";

export function useLayers() {
  const {
    layers,
    activeLayerId,
    setLayers,
    setActiveLayer,
  } = useDrawingStore();

  const layerManager = new LayerManager();

  const createLayer = useCallback((name: string) => {
    const newLayer = layerManager.createLayer(name);
    const updatedLayers = [...layers, newLayer];
    setLayers(updatedLayers);
    setActiveLayer(newLayer.id);
  }, [layers, setLayers, setActiveLayer]);

  const deleteLayer = useCallback((layerId: string) => {
    if (layers.length <= 1) return; // Don't delete the last layer
    
    const updatedLayers = layers.filter(layer => layer.id !== layerId);
    setLayers(updatedLayers);
    
    // If we deleted the active layer, select another one
    if (layerId === activeLayerId) {
      setActiveLayer(updatedLayers[0]?.id || '');
    }
  }, [layers, activeLayerId, setLayers, setActiveLayer]);

  const toggleLayerVisibility = useCallback((layerId: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId
        ? { ...layer, visible: !layer.visible }
        : layer
    );
    setLayers(updatedLayers);
  }, [layers, setLayers]);

  const updateLayerOpacity = useCallback((layerId: string, opacity: number) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId
        ? { ...layer, opacity }
        : layer
    );
    setLayers(updatedLayers);
  }, [layers, setLayers]);

  const moveLayerUp = useCallback((layerId: string) => {
    const currentIndex = layers.findIndex(layer => layer.id === layerId);
    if (currentIndex < layers.length - 1) {
      const updatedLayers = [...layers];
      [updatedLayers[currentIndex], updatedLayers[currentIndex + 1]] = 
      [updatedLayers[currentIndex + 1], updatedLayers[currentIndex]];
      setLayers(updatedLayers);
    }
  }, [layers, setLayers]);

  const moveLayerDown = useCallback((layerId: string) => {
    const currentIndex = layers.findIndex(layer => layer.id === layerId);
    if (currentIndex > 0) {
      const updatedLayers = [...layers];
      [updatedLayers[currentIndex], updatedLayers[currentIndex - 1]] = 
      [updatedLayers[currentIndex - 1], updatedLayers[currentIndex]];
      setLayers(updatedLayers);
    }
  }, [layers, setLayers]);

  const renameLayer = useCallback((layerId: string, name: string) => {
    const updatedLayers = layers.map(layer =>
      layer.id === layerId
        ? { ...layer, name }
        : layer
    );
    setLayers(updatedLayers);
  }, [layers, setLayers]);

  return {
    layers,
    activeLayerId,
    createLayer,
    deleteLayer,
    toggleLayerVisibility,
    setActiveLayer,
    moveLayerUp,
    moveLayerDown,
    updateLayerOpacity,
    renameLayer,
  };
}
