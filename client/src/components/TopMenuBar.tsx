import { useState } from "react";
import { 
  Folder, 
  Share, 
  Download, 
  Settings, 
  HelpCircle, 
  ChevronDown,
  Save,
  FolderOpen,
  Image,
  FileVideo,
  Zap
} from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function TopMenuBar() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <div className="h-16 bg-premium-surface border-b border-premium flex items-center justify-between px-6">
      
      {/* Left Section - Gallery & Project */}
      <div className="flex items-center space-x-4">
        
        {/* App Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">Studio Pro</h1>
            <p className="text-white/50 text-xs">Professional Drawing Suite</p>
          </div>
        </div>

        <div className="w-px h-8 bg-premium-border" />

        {/* Gallery Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              className="premium-button text-white/70 hover:text-white"
              onClick={() => setIsGalleryOpen(!isGalleryOpen)}
            >
              <Folder className="w-5 h-5 mr-2" />
              Gallery
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="glass-panel-dark text-white border-white/20">
            Open project gallery
          </TooltipContent>
        </Tooltip>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="premium-button text-white/70 hover:text-white">
                <FolderOpen className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              Open Project (⌘O)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="premium-button text-white/70 hover:text-white">
                <Save className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              Save Project (⌘S)
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Center Section - Project Info */}
      <div className="flex items-center space-x-4">
        <div className="text-center">
          <div className="text-white font-medium text-sm">Untitled Artwork</div>
          <div className="text-white/50 text-xs">4096 × 4096 • 32 Layers</div>
        </div>
      </div>

      {/* Right Section - Export & Settings */}
      <div className="flex items-center space-x-4">
        
        {/* Export Actions */}
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="premium-button text-white/70 hover:text-white">
                <Image className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              Export as Image
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="premium-button text-white/70 hover:text-white">
                <FileVideo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              Export Animation
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-8 bg-premium-border" />

        {/* Share Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              className="premium-button-primary"
              onClick={() => setIsShareOpen(!isShareOpen)}
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent className="glass-panel-dark text-white border-white/20">
            Share your artwork
          </TooltipContent>
        </Tooltip>

        {/* Settings & Help */}
        <div className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="premium-button text-white/70 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              Settings (⌘,)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="premium-button text-white/70 hover:text-white">
                <HelpCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="glass-panel-dark text-white border-white/20">
              Help & Support
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Gallery Dropdown */}
      {isGalleryOpen && (
        <div className="absolute top-16 left-6 z-50 w-80 glass-panel-dark rounded-xl border border-white/20 shadow-2xl animate-slide-in">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-3">Recent Projects</h3>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">Artwork {i + 1}</div>
                    <div className="text-white/50 text-xs">Modified 2 hours ago</div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 premium-button">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      )}

      {/* Share Dropdown */}
      {isShareOpen && (
        <div className="absolute top-16 right-6 z-50 w-64 glass-panel-dark rounded-xl border border-white/20 shadow-2xl animate-slide-in">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-3">Share Options</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start premium-button text-white/70 hover:text-white">
                <Download className="w-4 h-4 mr-3" />
                Download
              </Button>
              <Button variant="ghost" className="w-full justify-start premium-button text-white/70 hover:text-white">
                <Share className="w-4 h-4 mr-3" />
                Copy Link
              </Button>
              <Button variant="ghost" className="w-full justify-start premium-button text-white/70 hover:text-white">
                <Image className="w-4 h-4 mr-3" />
                Social Media
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}