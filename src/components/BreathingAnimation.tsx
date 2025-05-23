
import { useEffect, useState } from "react";
import { createSoothingSound, triggerHapticPattern } from "@/utils/audioUtils";
import type { SoundType, HapticPattern } from "@/utils/audioUtils";

interface BreathingAnimationProps {
  phase?: 'inhale' | 'hold-inhale' | 'exhale' | 'hold-exhale';
  duration?: number;
  isActive?: boolean;
}

const BreathingAnimation = ({ 
  phase = 'inhale', 
  duration = 4000, 
  isActive = false 
}: BreathingAnimationProps) => {
  const [animationScale, setAnimationScale] = useState(0.8);

  useEffect(() => {
    if (!isActive) {
      setAnimationScale(0.8);
      return;
    }

    let targetScale = 0.8;
    let easingFunction = "ease-in-out";

    // Update animation according to the breathing phase
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

    // Set the animation properties
    const element = document.getElementById('breathing-circle');
    if (element) {
      element.style.transition = `transform ${duration}ms ${easingFunction}`;
      element.style.transform = `scale(${targetScale})`;
    }

    setAnimationScale(targetScale);

    // Provide haptic feedback if enabled
    const hapticEnabled = localStorage.getItem('sereneflow-haptic') !== 'false';
    if (hapticEnabled) {
      const hapticPattern = (localStorage.getItem('sereneflow-haptic-pattern') as HapticPattern) || 'gentle';
      
      // Different patterns for different phases
      if (phase === 'inhale' || phase === 'exhale') {
        triggerHapticPattern(hapticPattern);
      } else {
        // Lighter feedback for hold phases
        triggerHapticPattern('subtle');
      }
    }

    // Provide sound feedback if enabled
    const soundEnabled = localStorage.getItem('sereneflow-sound') === 'true';
    if (soundEnabled) {
      const soundType = (localStorage.getItem('sereneflow-sound-type') as SoundType) || 'gentle-bells';
      createSoothingSound(soundType, phase);
    }
  }, [phase, duration, isActive]);

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-indigo-500 to-blue-400';
      case 'hold-inhale':
        return 'from-blue-400 to-cyan-400';
      case 'exhale':
        return 'from-cyan-400 to-teal-400';
      case 'hold-exhale':
        return 'from-teal-400 to-indigo-500';
      default:
        return 'from-indigo-500 to-blue-400';
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
        <div className="w-80 h-80 rounded-full border-2 border-slate-300 dark:border-slate-600 opacity-40"></div>
        
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
          <div className="absolute inset-2 rounded-full bg-white/30 backdrop-blur-sm"></div>
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-90"></div>
      </div>

      {/* Phase indicator */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          {getPhaseText()}
        </h2>
        <div className="text-lg text-slate-600 dark:text-slate-300 font-semibold">
          {Math.ceil(duration / 1000)}s
        </div>
      </div>
    </div>
  );
};

export default BreathingAnimation;
