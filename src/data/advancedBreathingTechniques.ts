
export interface AdvancedBreathingTechnique {
  id: string;
  name: string;
  description: string;
  category: 'pranayama' | 'wim-hof' | 'meditation' | 'therapeutic';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  benefits: string[];
  instructions: string[];
  warnings?: string[];
  defaultPattern: {
    inhale: number;
    holdAfterInhale: number;
    exhale: number;
    holdAfterExhale: number;
    rounds?: number;
  };
  voiceGuidance?: boolean;
  biofeedbackSupport?: boolean;
}

export const advancedBreathingTechniques: AdvancedBreathingTechnique[] = [
  {
    id: 'wim-hof-basic',
    name: 'Wim Hof Method - Basic',
    description: 'Controlled hyperventilation followed by breath retention for improved stress resilience and energy.',
    category: 'wim-hof',
    difficulty: 'Intermediate',
    duration: '15-20 min',
    benefits: ['Stress resilience', 'Energy boost', 'Immune system support', 'Mental clarity'],
    instructions: [
      'Sit or lie down comfortably in a safe environment',
      'Take 30 deep, powerful breaths',
      'Inhale fully through nose or mouth',
      'Exhale naturally without force',
      'After 30 breaths, exhale and hold as long as comfortable',
      'Take a recovery breath and hold for 15 seconds',
      'Repeat for 3-4 rounds'
    ],
    warnings: ['Do not practice while driving or in water', 'Stop if you feel dizzy'],
    defaultPattern: {
      inhale: 2,
      holdAfterInhale: 0,
      exhale: 1,
      holdAfterExhale: 0,
      rounds: 30
    },
    voiceGuidance: true,
    biofeedbackSupport: true
  },
  {
    id: 'kapalbhati',
    name: 'Kapalbhati Pranayama',
    description: 'Skull shining breath - rapid abdominal breathing for energy and cleansing.',
    category: 'pranayama',
    difficulty: 'Advanced',
    duration: '5-10 min',
    benefits: ['Digestive health', 'Mental clarity', 'Energy boost', 'Core strength'],
    instructions: [
      'Sit in comfortable cross-legged position',
      'Place hands on knees in mudra position',
      'Forceful exhale through nose by contracting abdomen',
      'Allow natural passive inhale',
      'Start with 20 breaths, gradually increase',
      'Rest between rounds'
    ],
    warnings: ['Avoid during pregnancy', 'Stop if experiencing dizziness'],
    defaultPattern: {
      inhale: 0.5,
      holdAfterInhale: 0,
      exhale: 0.3,
      holdAfterExhale: 0,
      rounds: 20
    },
    voiceGuidance: true
  },
  {
    id: 'bhastrika',
    name: 'Bhastrika Pranayama',
    description: 'Bellows breath - vigorous breathing for energy and heat generation.',
    category: 'pranayama',
    difficulty: 'Advanced',
    duration: '3-5 min',
    benefits: ['Energy generation', 'Metabolic boost', 'Mental alertness', 'Circulation'],
    instructions: [
      'Sit with spine straight',
      'Deep forceful inhale through nose',
      'Deep forceful exhale through nose',
      'Maintain equal force for inhale and exhale',
      'Complete 10 breaths per round',
      'Rest between rounds'
    ],
    warnings: ['Avoid with heart conditions', 'Practice on empty stomach'],
    defaultPattern: {
      inhale: 1,
      holdAfterInhale: 0,
      exhale: 1,
      holdAfterExhale: 0,
      rounds: 10
    },
    voiceGuidance: true
  },
  {
    id: 'meditation-breath',
    name: 'Meditation Breathing',
    description: 'Gentle, natural breathing for deep meditation and mindfulness practice.',
    category: 'meditation',
    difficulty: 'Beginner',
    duration: '10-30 min',
    benefits: ['Deep relaxation', 'Mindfulness', 'Stress reduction', 'Mental clarity'],
    instructions: [
      'Find comfortable seated position',
      'Close eyes or soften gaze',
      'Breathe naturally through nose',
      'Focus attention on breath sensation',
      'Return to breath when mind wanders',
      'Continue for desired duration'
    ],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 0,
      exhale: 4,
      holdAfterExhale: 0
    },
    voiceGuidance: true,
    biofeedbackSupport: true
  }
];

export const getAdvancedTechniquesByCategory = (category: string): AdvancedBreathingTechnique[] => {
  return advancedBreathingTechniques.filter(technique => technique.category === category);
};
