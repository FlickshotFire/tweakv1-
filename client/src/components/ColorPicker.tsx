import { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import { useDrawingStore } from "../lib/stores/useDrawingStore";
import { Palette } from "lucide-react";

export default function ColorPicker() {
  const { brushColor, setBrushColor, brushSize, setBrushSize, brushOpacity, setBrushOpacity } = useDrawingStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const commonColors = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#800080",
    "#ffc0cb", "#a52a2a", "#808080", "#00008b", "#8b4513"
  ];

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const currentRgb = hexToRgb(brushColor) || { r: 0, g: 0, b: 0 };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="p-2">
          <div className="flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded border border-gray-600"
              style={{ backgroundColor: brushColor }}
            />
            <Palette className="w-4 h-4" />
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 bg-gray-800 border-gray-600 text-white">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Color Picker</h4>
            
            {/* Current color display */}
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-12 h-12 rounded border border-gray-600"
                style={{ backgroundColor: brushColor }}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
            
            {/* Common colors */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {commonColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded border-2 ${
                    brushColor === color ? "border-white" : "border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setBrushColor(color)}
                />
              ))}
            </div>
            
            {/* RGB Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Red</label>
                  <span className="text-sm">{currentRgb.r}</span>
                </div>
                <Slider
                  value={[currentRgb.r]}
                  onValueChange={([value]) => 
                    setBrushColor(rgbToHex(value, currentRgb.g, currentRgb.b))
                  }
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Green</label>
                  <span className="text-sm">{currentRgb.g}</span>
                </div>
                <Slider
                  value={[currentRgb.g]}
                  onValueChange={([value]) => 
                    setBrushColor(rgbToHex(currentRgb.r, value, currentRgb.b))
                  }
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Blue</label>
                  <span className="text-sm">{currentRgb.b}</span>
                </div>
                <Slider
                  value={[currentRgb.b]}
                  onValueChange={([value]) => 
                    setBrushColor(rgbToHex(currentRgb.r, currentRgb.g, value))
                  }
                  max={255}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h4 className="font-medium mb-3">Brush Settings</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Size</label>
                  <span className="text-sm">{brushSize}px</span>
                </div>
                <Slider
                  value={[brushSize]}
                  onValueChange={([value]) => setBrushSize(value)}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm">Opacity</label>
                  <span className="text-sm">{Math.round(brushOpacity * 100)}%</span>
                </div>
                <Slider
                  value={[brushOpacity * 100]}
                  onValueChange={([value]) => setBrushOpacity(value / 100)}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
