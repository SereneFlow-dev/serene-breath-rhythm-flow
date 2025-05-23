
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Session from "./pages/Session";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Library from "./pages/Library";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./hooks/useAuth";
import { useEffect } from "react";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Force dark mode on app load
    document.documentElement.classList.add('dark');
    localStorage.setItem('sereneflow-theme', 'dark');
  }, []);

  return (
    <div className="min-h-screen w-screen bg-slate-900">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/session/:technique" element={<Session />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/library" element={<Library />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
