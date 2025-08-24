import { useEffect, useState } from "react";
import "@fontsource/inter";
import PremiumCanvas from "./components/PremiumCanvas";
import LeftToolbar from "./components/LeftToolbar";
import RightToolbar from "./components/RightToolbar";
import TopMenuBar from "./components/TopMenuBar";
import BottomTimeline from "./components/BottomTimeline";
import { useDrawingStore } from "./lib/stores/useDrawingStore";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { currentTool, isDrawing } = useDrawingStore();

  useEffect(() => {
    // Smooth loading animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TooltipProvider>
      <div className="h-screen bg-premium-dark overflow-hidden">
        {/* Premium Loading Animation */}
        <div 
          className={`absolute inset-0 bg-premium-dark z-50 transition-opacity duration-500 ${
            isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/70 text-sm">Loading Premium Studio...</p>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <div className={`h-full transition-transform duration-700 ease-out ${isLoaded ? 'translate-y-0' : 'translate-y-4'}`}>
          
          {/* Top Menu Bar */}
          <TopMenuBar />

          {/* Main Content Area */}
          <div className="flex h-[calc(100vh-120px)]">
            
            {/* Left Toolbar - Procreate Style */}
            <LeftToolbar />

            {/* Center Canvas Area */}
            <div className="flex-1 relative bg-gradient-to-br from-slate-50 to-gray-100 border-l border-r border-white/10">
              
              {/* Canvas Container */}
              <div className="absolute inset-4">
                <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <PremiumCanvas />
                </div>
              </div>

              {/* Floating Tool Indicator */}
              <div className="absolute top-8 left-8 z-10">
                <div className="bg-black/80 backdrop-blur-xl text-white px-4 py-2 rounded-full shadow-lg border border-white/10">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      isDrawing ? 'bg-red-400 animate-pulse' : 'bg-blue-400'
                    }`}></div>
                    <span className="text-sm font-medium capitalize">{currentTool}</span>
                  </div>
                </div>
              </div>

              {/* Canvas Controls */}
              <div className="absolute bottom-8 right-8 z-10">
                <div className="flex space-x-2">
                  <button className="w-12 h-12 bg-black/80 backdrop-blur-xl text-white rounded-full shadow-lg border border-white/10 hover:bg-black/90 transition-all duration-200 flex items-center justify-center">
                    <span className="text-lg">⟲</span>
                  </button>
                  <button className="w-12 h-12 bg-black/80 backdrop-blur-xl text-white rounded-full shadow-lg border border-white/10 hover:bg-black/90 transition-all duration-200 flex items-center justify-center">
                    <span className="text-lg">⟳</span>
                  </button>
                  <button className="w-12 h-12 bg-black/80 backdrop-blur-xl text-white rounded-full shadow-lg border border-white/10 hover:bg-black/90 transition-all duration-200 flex items-center justify-center">
                    <span className="text-lg">⚡</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Toolbar */}
            <RightToolbar />
          </div>

          {/* Bottom Timeline */}
          <BottomTimeline />
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
