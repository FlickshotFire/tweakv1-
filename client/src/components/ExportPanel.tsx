import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useDrawingStore } from "../lib/stores/useDrawingStore";
import { ExportManager } from "../lib/drawing/ExportManager";
import { Download, Image, Video, FileJson } from "lucide-react";

export default function ExportPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"png" | "svg" | "gif" | "mp4" | "json">("png");
  const [isExporting, setIsExporting] = useState(false);
  
  const { strokes, layers } = useDrawingStore();
  const exportManager = new ExportManager();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let result;
      
      switch (exportFormat) {
        case "png":
          result = await exportManager.exportAsPNG(strokes, layers);
          break;
        case "svg":
          result = await exportManager.exportAsSVG(strokes, layers);
          break;
        case "gif":
          result = await exportManager.exportAsGIF(strokes, layers);
          break;
        case "mp4":
          result = await exportManager.exportAsMP4(strokes, layers);
          break;
        case "json":
          result = await exportManager.exportAsJSON(strokes, layers);
          break;
        default:
          throw new Error("Unsupported format");
      }
      
      // Download the file
      const link = document.createElement("a");
      link.href = result.url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatOptions = [
    { value: "png", label: "PNG Image", icon: Image },
    { value: "svg", label: "SVG Vector", icon: Image },
    { value: "gif", label: "Animated GIF", icon: Video },
    { value: "mp4", label: "MP4 Video", icon: Video },
    { value: "json", label: "JSON Data", icon: FileJson },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-gray-800 border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle>Export Drawing</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-white">
                {formatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <option.icon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Format-specific options */}
          {(exportFormat === "gif" || exportFormat === "mp4") && (
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="text-sm font-medium mb-2">Animation Options</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Frame rate: Based on timeline settings</p>
                <p>• Duration: {layers.length} frames</p>
                <p>• Quality: High</p>
              </div>
            </div>
          )}

          {exportFormat === "png" && (
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="text-sm font-medium mb-2">Image Options</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Resolution: 1920x1080px</p>
                <p>• Background: Transparent</p>
                <p>• Quality: High</p>
              </div>
            </div>
          )}

          {exportFormat === "json" && (
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="text-sm font-medium mb-2">Data Export</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Includes all stroke data</p>
                <p>• Layer information</p>
                <p>• Animation timeline</p>
                <p>• Can be reimported later</p>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? "Exporting..." : `Export as ${exportFormat.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
