import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useLayers } from "../hooks/useLayers";
import { Eye, EyeOff, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";

export default function LayerPanel() {
  const {
    layers,
    activeLayerId,
    createLayer,
    deleteLayer,
    toggleLayerVisibility,
    setActiveLayer,
    moveLayerUp,
    moveLayerDown,
    updateLayerOpacity,
    renameLayer
  } = useLayers();

  const [newLayerName, setNewLayerName] = useState("");

  const handleCreateLayer = () => {
    const name = newLayerName.trim() || `Layer ${layers.length + 1}`;
    createLayer(name);
    setNewLayerName("");
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Layers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Create new layer */}
        <div className="flex space-x-2">
          <Input
            placeholder="Layer name"
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateLayer()}
            className="bg-gray-800 border-gray-600 text-white"
          />
          <Button onClick={handleCreateLayer} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Layer list */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {layers.map((layer, index) => (
            <Card
              key={layer.id}
              className={`cursor-pointer transition-colors ${
                layer.id === activeLayerId
                  ? "bg-blue-900 border-blue-600"
                  : "bg-gray-800 border-gray-600 hover:bg-gray-700"
              }`}
              onClick={() => setActiveLayer(layer.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium truncate">
                    {layer.name}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisibility(layer.id);
                      }}
                      className="p-1"
                    >
                      {layer.visible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                      className="p-1 text-red-400 hover:text-red-300"
                      disabled={layers.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Opacity slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Opacity</span>
                    <span className="text-xs text-gray-400">
                      {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[layer.opacity * 100]}
                    onValueChange={([value]) =>
                      updateLayerOpacity(layer.id, value / 100)
                    }
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Layer controls */}
                <div className="flex justify-between mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerUp(layer.id);
                    }}
                    disabled={index === layers.length - 1}
                    className="p-1"
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerDown(layer.id);
                    }}
                    disabled={index === 0}
                    className="p-1"
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
