
export type SoundType = 'gentle-bells' | 'nature-sounds' | 'singing-bowls' | 'soft-tones' | 'silent';
export type HapticPattern = 'gentle' | 'rhythmic' | 'progressive' | 'subtle' | 'strong' | 'off';

interface SoundConfig {
  name: string;
  description: string;
  frequencies: {
    inhale: number;
    'hold-inhale': number;
    exhale: number;
    'hold-exhale': number;
  };
  waveType: OscillatorType;
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
}

export const soundConfigs: Record<SoundType, SoundConfig> = {
  'gentle-bells': {
    name: 'Gentle Bells',
    description: 'Soft, peaceful chimes',
    frequencies: {
      inhale: 523,     // C5
      'hold-inhale': 659,   // E5
      exhale: 392,     // G4
      'hold-exhale': 349   // F4
    },
    waveType: 'sine',
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.3, release: 0.8 }
  },
  'nature-sounds': {
    name: 'Nature Sounds',
    description: 'Water drops and wind chimes',
    frequencies: {
      inhale: 440,     // A4
      'hold-inhale': 554,   // C#5
      exhale: 330,     // E4
      'hold-exhale': 294   // D4
    },
    waveType: 'triangle',
    envelope: { attack: 0.2, decay: 0.4, sustain: 0.2, release: 1.0 }
  },
  'singing-bowls': {
    name: 'Singing Bowls',
    description: 'Meditation bowl tones',
    frequencies: {
      inhale: 256,     // C4
      'hold-inhale': 341,   // F4
      exhale: 192,     // G3
      'hold-exhale': 171   // F3
    },
    waveType: 'sine',
    envelope: { attack: 0.3, decay: 0.5, sustain: 0.4, release: 1.5 }
  },
  'soft-tones': {
    name: 'Soft Tones',
    description: 'Warm, rounded tones',
    frequencies: {
      inhale: 432,     // A4 (432Hz tuning)
      'hold-inhale': 540,   // C#5
      exhale: 324,     // E4
      'hold-exhale': 288   // D4
    },
    waveType: 'sine',
    envelope: { attack: 0.15, decay: 0.2, sustain: 0.5, release: 0.6 }
  },
  'silent': {
    name: 'Silent',
    description: 'No sound',
    frequencies: {
      inhale: 0,
      'hold-inhale': 0,
      exhale: 0,
      'hold-exhale': 0
    },
    waveType: 'sine',
    envelope: { attack: 0, decay: 0, sustain: 0, release: 0 }
  }
};

export const hapticPatterns: Record<HapticPattern, { name: string; description: string; pattern: number[] }> = {
  gentle: {
    name: 'Gentle',
    description: 'Soft, single pulses',
    pattern: [50]
  },
  rhythmic: {
    name: 'Rhythmic',
    description: 'Pattern-based vibrations',
    pattern: [100, 50, 100]
  },
  progressive: {
    name: 'Progressive',
    description: 'Gradually increasing intensity',
    pattern: [50, 30, 80, 30, 120]
  },
  subtle: {
    name: 'Subtle',
    description: 'Very light vibrations',
    pattern: [30]
  },
  strong: {
    name: 'Strong',
    description: 'More pronounced feedback',
    pattern: [150]
  },
  off: {
    name: 'Off',
    description: 'No haptic feedback',
    pattern: []
  }
};

export const createSoothingSound = (
  soundType: SoundType,
  phase: 'inhale' | 'hold-inhale' | 'exhale' | 'hold-exhale'
) => {
  if (soundType === 'silent') return;

  try {
    const config = soundConfigs[soundType];
    const frequency = config.frequencies[phase];
    
    if (frequency === 0) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    // Set up filter for warmth
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);
    filterNode.Q.setValueAtTime(1, audioContext.currentTime);
    
    // Connect nodes
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure oscillator
    oscillator.type = config.waveType;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    // Apply envelope
    const { attack, decay, sustain, release } = config.envelope;
    const now = audioContext.currentTime;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + attack);
    gainNode.gain.linearRampToValueAtTime(0.1 * sustain, now + attack + decay);
    gainNode.gain.setValueAtTime(0.1 * sustain, now + attack + decay + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, now + attack + decay + 0.1 + release);
    
    oscillator.start(now);
    oscillator.stop(now + attack + decay + 0.1 + release);
  } catch (error) {
    console.log('Audio not supported');
  }
};

export const triggerHapticPattern = (pattern: HapticPattern) => {
  const hapticEnabled = localStorage.getItem('sereneflow-haptic') !== 'false';
  if (!hapticEnabled || !('vibrate' in navigator)) return;

  try {
    const patternConfig = hapticPatterns[pattern];
    if (patternConfig.pattern.length > 0) {
      navigator.vibrate(patternConfig.pattern);
    }
  } catch (error) {
    console.log('Vibration not supported');
  }
};
