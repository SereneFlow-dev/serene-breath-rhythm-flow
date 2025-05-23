
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete?: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const quotes = [
    "Find your rhythm, master your breath",
    "Breathe deeply, live mindfully",
    "In every breath, find your calm",
    "Your peace is just one breath away",
    "Breathe in serenity, breathe out stress"
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    // Set a timeout to hide the loading screen after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade out animation before calling onComplete if provided
      if (onComplete) {
        setTimeout(onComplete, 300);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return null; // Return null when not visible to ensure it's completely removed
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-serene-teal/20 to-blue-200/30 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center z-50 animate-fade-in">
      <div className="text-center px-8">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-serene-teal to-blue-400 shadow-2xl animate-pulse"></div>
          <h1 className="text-4xl font-light text-slate-800 dark:text-white mb-4 tracking-wide">
            SereneFlow
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-light italic max-w-sm mx-auto leading-relaxed">
            "{randomQuote}"
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-8 h-8 border-2 border-serene-teal border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
