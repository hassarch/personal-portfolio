import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TerminalProvider, useTerminal } from "@/contexts/TerminalContext";
import TerminalOverlay from "@/components/TerminalOverlay";
import BootSequence from "@/components/BootSequence";

import Index from "./pages/Index";

const queryClient = new QueryClient();

/**
 * Inner app component that has access to TerminalContext
 */
const AppContent = () => {
  const { state, dispatch } = useTerminal();
  const [showContent, setShowContent] = useState(state.bootCompleted);

  const handleBootComplete = () => {
    dispatch({ type: 'BOOT_COMPLETE' });
    setShowContent(true);
  };

  return (
    <>
      <TerminalOverlay />
      <Toaster />
      <Sonner />

      {/* Boot sequence - only shows if not already completed this session */}
      {!state.bootCompleted && (
        <BootSequence onComplete={handleBootComplete} />
      )}

      {/* Main content - renders after boot completes */}
      {showContent && <Index />}

      {/* Vercel Analytics */}
      <Analytics />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TerminalProvider>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </TerminalProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
