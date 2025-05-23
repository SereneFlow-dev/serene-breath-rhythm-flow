
import { useEffect, useState } from "react";

interface BreathingAnimationProps {
  phase?: 'inhale' | 'hold-inhale' | 'exhale' | 'hold-exhale';
  duration?: number;
  isActive?: boolean;
}

const BreathingAnimation = ({ 
  phase = 'inhale', 
  duration = 4000, 
  isActive = true 
}: BreathingAnimationProps) => {
  const [animationScale, setAnimationScale] = useState(0.9);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold-inhale' | 'exhale' | 'hold-exhale'>('inhale');

  // Auto-cycling animation when isActive is true
  useEffect(() => {
    if (!isActive) {
      setAnimationScale(0.9);
      return;
    }

    // Auto-cycle through breathing phases
    const phases: Array<'inhale' | 'hold-inhale' | 'exhale' | 'hold-exhale'> = 
      ['inhale', 'hold-inhale', 'exhale', 'hold-exhale'];
    const durations = [3000, 500, 3000, 500]; // Faster, more appealing rhythm
    
    let phaseIndex = 0;
    
    const nextPhase = () => {
      if (!isActive) return;
      
      setCurrentPhase(phases[phaseIndex]);
      phaseIndex = (phaseIndex + 1) % phases.length;
      
      setTimeout(nextPhase, durations[phaseIndex === 0 ? phases.length - 1 : phaseIndex - 1]);
    };
    
    nextPhase();
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setAnimationScale(0.9);
      return;
    }

    let targetScale = 0.9;
    
    // Update animation according to the breathing phase
    switch (currentPhase) {
      case 'inhale':
        targetScale = 1.1;
        break;
      case 'hold-inhale':
        targetScale = 1.1;
        break;
      case 'exhale':
        targetScale = 0.9;
        break;
      case 'hold-exhale':
        targetScale = 0.9;
        break;
    }

    setAnimationScale(targetScale);
  }, [currentPhase, isActive]);

  const getEasingFunction = () => {
    switch (currentPhase) {
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
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Outer ring - smaller */}
        <div className="w-48 h-48 rounded-full border border-slate-300 dark:border-slate-600 opacity-30"></div>
        
        {/* Breathing circle - consistent gradient that looks good when scaling */}
        <div
          className="absolute inset-3 rounded-full bg-gradient-to-br from-indigo-500 via-blue-400 to-cyan-400 shadow-lg opacity-80"
          style={{
            transform: `scale(${animationScale})`,
            transition: isActive ? `transform 3000ms ${getEasingFunction()}` : 'transform 500ms ease-in-out'
          }}
        >
          {/* Inner glow effect - more subtle */}
          <div className="absolute inset-3 rounded-full bg-white/20 backdrop-blur-sm"></div>
        </div>

        {/* Center dot - smaller */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-70"></div>
      </div>
    </div>
  );
};

export default BreathingAnimation;
