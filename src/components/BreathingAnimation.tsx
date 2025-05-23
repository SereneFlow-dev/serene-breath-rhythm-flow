
import { useEffect, useState } from "react";

interface BreathingAnimationProps {
  phase: 'inhale' | 'hold-inhale' | 'exhale' | 'hold-exhale';
  duration: number;
  isActive: boolean;
}

const BreathingAnimation = ({ phase, duration, isActive }: BreathingAnimationProps) => {
  const [animationScale, setAnimationScale] = useState(0.8);

  useEffect(() => {
    if (!isActive) {
      setAnimationScale(0.8);
      return;
    }

    let targetScale = 0.8;
    let easingFunction = "ease-in-out";

    switch (phase) {
      case 'inhale':
        targetScale = 1.3;
        easingFunction = "ease-out";
        break;
      case 'hold-inhale':
        targetScale = 1.3;
        easingFunction = "linear";
        break;
      case 'exhale':
        targetScale = 0.8;
        easingFunction = "ease-in";
        break;
      case 'hold-exhale':
        targetScale = 0.8;
        easingFunction = "linear";
        break;
    }

    const element = document.getElementById('breathing-circle');
    if (element) {
      element.style.transition = `transform ${duration}ms ${easingFunction}`;
      element.style.transform = `scale(${targetScale})`;
    }

    setAnimationScale(targetScale);
  }, [phase, duration, isActive]);

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-300';
      case 'hold-inhale':
        return 'from-cyan-300 to-teal-300';
      case 'exhale':
        return 'from-teal-300 to-green-300';
      case 'hold-exhale':
        return 'from-green-300 to-blue-400';
      default:
        return 'from-blue-400 to-cyan-300';
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold-inhale':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold-exhale':
        return 'Hold';
      default:
        return 'Breathe';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative mb-8">
        {/* Outer ring */}
        <div className="w-80 h-80 rounded-full border-2 border-gray-200 dark:border-gray-700 opacity-30"></div>
        
        {/* Breathing circle */}
        <div
          id="breathing-circle"
          className={`absolute inset-4 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl`}
          style={{
            transform: `scale(${animationScale})`,
            transition: isActive ? undefined : 'transform 500ms ease-in-out'
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm"></div>
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-80"></div>
      </div>

      {/* Phase indicator */}
      <div className="text-center">
        <h2 className="text-2xl font-light text-slate-700 dark:text-slate-300 mb-2">
          {getPhaseText()}
        </h2>
        <div className="text-lg text-slate-500 dark:text-slate-400">
          {Math.ceil(duration / 1000)}s
        </div>
      </div>
    </div>
  );
};

export default BreathingAnimation;
