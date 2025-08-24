import { useState } from "react";
import { useDrawingStore } from "../lib/stores/useDrawingStore";
import { useLayers } from "../hooks/useLayers";
import { 
  Layers, 
  Plus, 
  Eye, 
  EyeOff, 
  Trash2, 
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Palette,
  Brush,
  Settings
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

export default function RightToolbar() {
  const [activeTab, setActiveTab] = useState<'layers' | 'brushes' | 'colors' | 'properties'>('layers');
  const { 
    brushColor, 
    setBrushColor, 
    brushSize, 
    setBrushSize, 
    brushOpacity, 
    setBrushOpacity 
  } = useDrawingStore();
  
  const {
    layers,
    activeLayerId,
    createLayer,
    deleteLayer,
    toggleLayerVisibility,
    setActiveLayer,
    updateLayerOpacity,
  } = useLayers();

  const tabs = [
    { id: 'layers', icon: Layers, label: 'Layers' },
    { id: 'brushes', icon: Brush, label: 'Brushes' },
    { id: 'colors', icon: Palette, label: 'Colors' },
    { id: 'properties', icon: Settings, label: 'Properties' },
  ];

  const LayersPanel = () => (
    <div className="space-y-4">
      {/* Add Layer Button */}
      <Button 
        onClick={() => createLayer(`Layer ${layers.length + 1}`)}
        className="w-full premium-button-primary"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Layer
      </Button>

      {/* Layers List */}
      <div className="space-y-2 max-h-80 overflow-y-auto hide-scrollbar">
        {layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`
              glass-panel rounded-xl p-3 cursor-pointer transition-all duration-200
              ${layer.id === activeLayerId 
                ? 'border-blue-500/50 bg-blue-500/10' 
                : 'hover:bg-white/5'
              }
            `}
            onClick={() => setActiveLayer(layer.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium text-sm truncate">
                {layer.name}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4 text-white/70" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-white/30" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (layers.length > 1) deleteLayer(layer.id);
                  }}
                  disabled={layers.length <= 1}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/50">Opacity</span>
                <span className="text-xs text-white/70">
                  {Math.round(layer.opacity * 100)}%
                </span>
              </div>
              <Slider
                value={[layer.opacity * 100]}
                onValueChange={([value]) => updateLayerOpacity(layer.id, value / 100)}
                max={100}
                step={1}
                className="premium-slider"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const BrushesPanel = () => (
    <div className="space-y-4">
      <div className="text-sm font-medium text-white mb-4">Brush Library</div>
      
      {/* Brush Categories */}
      <div className="space-y-2">
        {['Sketching', 'Inking', 'Painting', 'Artistic', 'Custom'].map((category) => (
          <div key={category} className="glass-panel rounded-xl p-3">
            <div className="flex items-center justify-between cursor-pointer">
              <span className="text-white text-sm">{category}</span>
              <ChevronRight className="w-4 h-4 text-white/50" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Brushes */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="aspect-square glass-panel rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
            <div 
              className="w-6 h-6 bg-white rounded-full opacity-70"
              style={{
                transform: `scale(${0.5 + (i % 3) * 0.25})`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const ColorsPanel = () => (
    <div className="space-y-4">
      {/* Current Color */}
      <div className="glass-panel rounded-xl p-4">
        <div className="text-sm font-medium text-white mb-3">Current Color</div>
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-xl border-2 border-white/20 shadow-lg"
            style={{ backgroundColor: brushColor }}
          />
          <div className="flex-1">
            <input
              type="text"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="glass-panel rounded-xl p-4">
        <div className="text-sm font-medium text-white mb-3">Palette</div>
        <div className="grid grid-cols-6 gap-2">
          {[
            '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
            '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb', '#a52a2a',
            '#808080', '#00008b', '#8b4513', '#2e8b57', '#4682b4', '#d2691e'
          ].map((color) => (
            <button
              key={color}
              className={`
                aspect-square rounded-lg border-2 transition-all duration-200 hover:scale-110
                ${brushColor === color ? 'border-white shadow-lg' : 'border-white/20'}
              `}
              style={{ backgroundColor: color }}
              onClick={() => setBrushColor(color)}
            />
          ))}
        </div>
      </div>

      {/* Color Wheel */}
      <div className="glass-panel rounded-xl p-4">
        <div className="text-sm font-medium text-white mb-3">Color Wheel</div>
        <div className="w-full aspect-square bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-full border border-white/20 cursor-pointer">
          {/* TODO: Implement interactive color wheel */}
        </div>
      </div>
    </div>
  );

  const PropertiesPanel = () => (
    <div className="space-y-6">
      {/* Brush Size */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">Size</span>
          <span className="text-sm text-white/70">{brushSize}px</span>
        </div>
        <Slider
          value={[brushSize]}
          onValueChange={([value]) => setBrushSize(value)}
          min={1}
          max={100}
          step={1}
          className="premium-slider"
        />
      </div>

      {/* Brush Opacity */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">Opacity</span>
          <span className="text-sm text-white/70">{Math.round(brushOpacity * 100)}%</span>
        </div>
        <Slider
          value={[brushOpacity * 100]}
          onValueChange={([value]) => setBrushOpacity(value / 100)}
          min={1}
          max={100}
          step={1}
          className="premium-slider"
        />
      </div>

      {/* Brush Hardness */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">Hardness</span>
          <span className="text-sm text-white/70">80%</span>
        </div>
        <Slider
          value={[80]}
          onValueChange={() => {/* TODO: Implement hardness */}}
          min={0}
          max={100}
          step={1}
          className="premium-slider"
        />
      </div>

      {/* Pressure Sensitivity */}
      <div className="glass-panel rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-white">Pressure</span>
          <span className="text-sm text-white/70">Enabled</span>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" defaultChecked className="rounded" />
          <span className="text-sm text-white/70">Size</span>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input type="checkbox" defaultChecked className="rounded" />
          <span className="text-sm text-white/70">Opacity</span>
        </div>
      </div>
    </div>
  );

  const renderPanel = () => {
    switch (activeTab) {
      case 'layers':
        return <LayersPanel />;
      case 'brushes':
        return <BrushesPanel />;
      case 'colors':
        return <ColorsPanel />;
      case 'properties':
        return <PropertiesPanel />;
      default:
        return <LayersPanel />;
    }
  };

  return (
    <div className="w-80 bg-premium-surface border-l border-premium flex flex-col">
      
      {/* Tab Navigation */}
      <div className="border-b border-premium">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex-1 flex flex-col items-center justify-center py-3 transition-all duration-200
                ${activeTab === tab.id 
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10' 
                  : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                }
              `}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 p-4 overflow-y-auto hide-scrollbar">
        {renderPanel()}
      </div>
    </div>
  );
}