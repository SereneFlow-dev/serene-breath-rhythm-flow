
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
    
    // Update animation according to the breathing phase
    switch (phase) {
      case 'inhale':
        targetScale = 1.3;
        break;
      case 'hold-inhale':
        targetScale = 1.3;
        break;
      case 'exhale':
        targetScale = 0.8;
        break;
      case 'hold-exhale':
        targetScale = 0.8;
        break;
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
        return 'from-primary to-teal-500';
      case 'hold-inhale':
        return 'from-teal-500 to-teal-400';
      case 'exhale':
        return 'from-teal-400 to-accent';
      case 'hold-exhale':
        return 'from-accent to-primary';
      default:
        return 'from-primary to-teal-500';
    }
  };

  const getEasingFunction = () => {
    switch (phase) {
      case 'inhale':
        return 'ease-out';
      case 'hold-inhale':
        return 'linear';
      case 'exhale':
        return 'ease-in';
      case 'hold-exhale':
        return 'linear';
      default:
        return 'ease-in-out';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-80 h-80 rounded-full border-2 border-border opacity-40"></div>
        
        {/* Breathing circle */}
        <div
          className={`absolute inset-4 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl`}
          style={{
            transform: `scale(${animationScale})`,
            transition: isActive ? `transform ${duration}ms ${getEasingFunction()}` : 'transform 500ms ease-in-out'
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-2 rounded-full bg-white/30 backdrop-blur-sm"></div>
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-90"></div>
      </div>
    </div>
  );
};

export default BreathingAnimation;
