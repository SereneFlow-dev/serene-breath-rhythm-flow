
export interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  category: string[];
  defaultPattern: {
    inhale: number;
    holdAfterInhale: number;
    exhale: number;
    holdAfterExhale: number;
    rounds?: number;
  };
  instructions: string[];
  customizable: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  pattern: string;
  warnings?: string[];
  voiceGuidance?: boolean;
}

export const breathingTechniques: BreathingTechnique[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Equal inhale, hold, exhale, hold counts. Promotes calm and focus through balanced breathing rhythm.',
    benefits: ['Stress reduction', 'Mental clarity', 'Emotional regulation', 'Focus enhancement'],
    category: ['Relaxation', 'Focus', 'Beginner'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 4,
      exhale: 4,
      holdAfterExhale: 4,
    },
    instructions: [
      'Sit comfortably with your back straight',
      'Inhale slowly through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly through your mouth for 4 counts',
      'Hold empty for 4 counts, then repeat'
    ],
    customizable: true,
    difficulty: 'Beginner',
    duration: '2-5 min',
    pattern: '4-4-4-4',
  },
  {
    id: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    description: 'Inhale for 4, hold for 7, exhale for 8. A powerful relaxation technique for deep calm and sleep.',
    benefits: ['Deep relaxation', 'Sleep aid', 'Anxiety reduction', 'Nervous system calm'],
    category: ['Relaxation', 'Sleep', 'Beginner'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 7,
      exhale: 8,
      holdAfterExhale: 0,
    },
    instructions: [
      'Place the tip of your tongue behind your upper teeth',
      'Exhale completely through your mouth',
      'Inhale through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through your mouth for 8 counts'
    ],
    customizable: true,
    difficulty: 'Beginner',
    duration: '3-5 min',
    pattern: '4-7-8-0',
  },
  {
    id: 'diaphragmatic-breathing',
    name: 'Diaphragmatic Breathing',
    description: 'Deep belly breathing that expands the diaphragm. Reduces stress and improves oxygen exchange.',
    benefits: ['Stress reduction', 'Lower heart rate', 'Improved oxygen exchange', 'Better posture'],
    category: ['Relaxation', 'Health', 'Beginner'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 1,
      exhale: 6,
      holdAfterExhale: 1,
    },
    instructions: [
      'Place one hand on your chest, one on your belly',
      'Breathe in slowly through your nose',
      'Feel your belly rise more than your chest',
      'Exhale slowly through pursed lips',
      'Focus on the gentle rise and fall of your belly'
    ],
    customizable: true,
    difficulty: 'Beginner',
    duration: '5-10 min',
    pattern: '4-1-6-1',
  },
  {
    id: 'coherence-breathing',
    name: 'Coherence Breathing',
    description: 'Breathing at 5-6 breaths per minute to balance the autonomic nervous system and improve heart rate variability.',
    benefits: ['Heart rate variability', 'Nervous system balance', 'Stress reduction', 'Focus improvement'],
    category: ['Focus', 'Health', 'Intermediate'],
    defaultPattern: {
      inhale: 5.5,
      holdAfterInhale: 0,
      exhale: 5.5,
      holdAfterExhale: 0,
    },
    instructions: [
      'Sit in a comfortable position',
      'Breathe naturally through your nose',
      'Inhale slowly for 5.5 seconds',
      'Exhale slowly for 5.5 seconds',
      'Maintain this steady rhythm'
    ],
    customizable: true,
    difficulty: 'Intermediate',
    duration: '5-15 min',
    pattern: '5.5-0-5.5-0',
  },
  {
    id: 'alternate-nostril',
    name: 'Nadi Shodhana (Alternate Nostril)',
    description: 'Traditional pranayama breathing through alternating nostrils to balance energy and calm the nervous system.',
    benefits: ['Energy balance', 'Nervous system calm', 'Improved focus', 'Mental clarity'],
    category: ['Pranayama', 'Focus', 'Energy', 'Intermediate'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 0,
      exhale: 6,
      holdAfterExhale: 0,
    },
    instructions: [
      'Use your right thumb to close your right nostril',
      'Inhale through your left nostril',
      'Close left nostril with ring finger, release thumb',
      'Exhale through your right nostril',
      'Continue alternating sides'
    ],
    customizable: true,
    difficulty: 'Intermediate',
    duration: '5-10 min',
    pattern: '4-0-6-0',
  },
  {
    id: 'energizing-breath',
    name: 'Energizing Breath',
    description: 'A simplified version of breath-work to increase energy and reduce stress. Practice safely.',
    benefits: ['Increased energy', 'Stress reduction', 'Mental alertness', 'Mood boost'],
    category: ['Energy', 'Advanced'],
    defaultPattern: {
      inhale: 2,
      holdAfterInhale: 0,
      exhale: 2,
      holdAfterExhale: 0,
    },
    instructions: [
      'Sit comfortably in a safe environment',
      'Take 30 deep, powerful breaths',
      'Inhale fully, exhale completely',
      'After 30 breaths, exhale and hold as long as comfortable',
      'Take a recovery breath and hold for 15 seconds'
    ],
    customizable: false,
    difficulty: 'Advanced',
    duration: '10-15 min',
    pattern: '2-0-2-0',
  },
  // New Indian Pranayama Techniques
  {
    id: 'kapalbhati',
    name: 'Kapalbhati Pranayama',
    description: 'Skull shining breath - rapid abdominal breathing for energy and cleansing.',
    benefits: ['Digestive health', 'Mental clarity', 'Energy boost', 'Core strength'],
    category: ['Pranayama', 'Energy', 'Advanced'],
    defaultPattern: {
      inhale: 0.5,
      holdAfterInhale: 0,
      exhale: 0.3,
      holdAfterExhale: 0,
      rounds: 20
    },
    instructions: [
      'Sit in comfortable cross-legged position',
      'Place hands on knees in mudra position',
      'Forceful exhale through nose by contracting abdomen',
      'Allow natural passive inhale',
      'Start with 20 breaths, gradually increase',
      'Rest between rounds'
    ],
    warnings: ['Avoid during pregnancy', 'Stop if experiencing dizziness'],
    customizable: true,
    difficulty: 'Advanced',
    duration: '5-10 min',
    pattern: '0.5-0-0.3-0',
    voiceGuidance: true
  },
  {
    id: 'bhastrika',
    name: 'Bhastrika Pranayama',
    description: 'Bellows breath - vigorous breathing for energy and heat generation.',
    benefits: ['Energy generation', 'Metabolic boost', 'Mental alertness', 'Circulation'],
    category: ['Pranayama', 'Energy', 'Advanced'],
    defaultPattern: {
      inhale: 1,
      holdAfterInhale: 0,
      exhale: 1,
      holdAfterExhale: 0,
      rounds: 10
    },
    instructions: [
      'Sit with spine straight',
      'Deep forceful inhale through nose',
      'Deep forceful exhale through nose',
      'Maintain equal force for inhale and exhale',
      'Complete 10 breaths per round',
      'Rest between rounds'
    ],
    warnings: ['Avoid with heart conditions', 'Practice on empty stomach'],
    customizable: true,
    difficulty: 'Advanced',
    duration: '3-5 min',
    pattern: '1-0-1-0',
    voiceGuidance: true
  },
  {
    id: 'ujjayi',
    name: 'Ujjayi Pranayama',
    description: 'Ocean breath - deep breathing with slight throat constriction for calming effect.',
    benefits: ['Stress reduction', 'Focus enhancement', 'Internal heat', 'Meditation support'],
    category: ['Pranayama', 'Relaxation', 'Intermediate'],
    defaultPattern: {
      inhale: 6,
      holdAfterInhale: 2,
      exhale: 6,
      holdAfterExhale: 2,
    },
    instructions: [
      'Sit comfortably with spine straight',
      'Breathe through nose only',
      'Slightly constrict throat to create ocean sound',
      'Inhale slowly and deeply',
      'Exhale with same controlled sound',
      'Maintain steady rhythm'
    ],
    customizable: true,
    difficulty: 'Intermediate',
    duration: '5-15 min',
    pattern: '6-2-6-2',
    voiceGuidance: true
  },
  {
    id: 'bhramari',
    name: 'Bhramari Pranayama',
    description: 'Humming bee breath - breathing with humming sound for deep relaxation.',
    benefits: ['Stress relief', 'Mental calmness', 'Concentration', 'Sound therapy'],
    category: ['Pranayama', 'Relaxation', 'Intermediate'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 1,
      exhale: 6,
      holdAfterExhale: 1,
    },
    instructions: [
      'Sit comfortably with eyes closed',
      'Place thumbs in ears, fingers over eyes',
      'Inhale normally through nose',
      'Exhale while making humming sound',
      'Focus on the vibration in your head',
      'Continue for several rounds'
    ],
    customizable: true,
    difficulty: 'Intermediate',
    duration: '5-10 min',
    pattern: '4-1-6-1',
    voiceGuidance: true
  },
  {
    id: 'surya-bhedana',
    name: 'Surya Bhedana',
    description: 'Right nostril breathing to activate solar energy and increase body heat.',
    benefits: ['Energy boost', 'Body heat', 'Digestive fire', 'Mental alertness'],
    category: ['Pranayama', 'Energy', 'Intermediate'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 4,
      exhale: 4,
      holdAfterExhale: 0,
    },
    instructions: [
      'Close left nostril with ring finger',
      'Inhale only through right nostril',
      'Close both nostrils and hold breath',
      'Release left nostril and exhale',
      'Keep right nostril closed throughout',
      'Repeat the cycle'
    ],
    customizable: true,
    difficulty: 'Intermediate',
    duration: '5-10 min',
    pattern: '4-4-4-0',
    voiceGuidance: true
  },
  {
    id: 'chandra-bhedana',
    name: 'Chandra Bhedana',
    description: 'Left nostril breathing to activate lunar energy and create cooling effect.',
    benefits: ['Cooling effect', 'Stress reduction', 'Blood pressure control', 'Mental calm'],
    category: ['Pranayama', 'Relaxation', 'Intermediate'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 4,
      exhale: 4,
      holdAfterExhale: 0,
    },
    instructions: [
      'Close right nostril with thumb',
      'Inhale only through left nostril',
      'Close both nostrils and hold breath',
      'Release right nostril and exhale',
      'Keep left nostril closed throughout',
      'Repeat the cycle'
    ],
    customizable: true,
    difficulty: 'Intermediate',
    duration: '5-10 min',
    pattern: '4-4-4-0',
    voiceGuidance: true
  },
  {
    id: 'anulom-vilom',
    name: 'Anulom Vilom',
    description: 'Complete alternate nostril breathing cycle for perfect balance and harmony.',
    benefits: ['Complete energy balance', 'Nervous system harmony', 'Blood circulation', 'Mental peace'],
    category: ['Pranayama', 'Focus', 'Health', 'Intermediate'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 4,
      exhale: 4,
      holdAfterExhale: 4,
    },
    instructions: [
      'Use Vishnu mudra hand position',
      'Close right nostril, inhale through left',
      'Close both nostrils, hold breath',
      'Release right nostril, exhale',
      'Inhale through right nostril',
      'Close both, hold, exhale through left'
    ],
    customizable: true,
    difficulty: 'Intermediate',
    duration: '10-15 min',
    pattern: '4-4-4-4',
    voiceGuidance: true
  },
  {
    id: 'sheetali',
    name: 'Sheetali Pranayama',
    description: 'Cooling breath through curled tongue to reduce body heat and calm mind.',
    benefits: ['Body cooling', 'Stress relief', 'Blood pressure control', 'Digestive aid'],
    category: ['Pranayama', 'Therapeutic', 'Beginner'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 2,
      exhale: 6,
      holdAfterExhale: 2,
    },
    instructions: [
      'Curl your tongue into a tube shape',
      'Inhale slowly through curled tongue',
      'Close mouth and hold breath briefly',
      'Exhale slowly through nose',
      'Feel the cooling sensation',
      'Practice in hot weather for best effect'
    ],
    customizable: true,
    difficulty: 'Beginner',
    duration: '5-10 min',
    pattern: '4-2-6-2',
    voiceGuidance: true
  },
  {
    id: 'sheetkari',
    name: 'Sheetkari Pranayama',
    description: 'Hissing breath through teeth for cooling and purification.',
    benefits: ['Body cooling', 'Oral health', 'Stress reduction', 'Mental clarity'],
    category: ['Pranayama', 'Therapeutic', 'Beginner'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 2,
      exhale: 6,
      holdAfterExhale: 2,
    },
    instructions: [
      'Open mouth slightly',
      'Place tongue against teeth',
      'Inhale with hissing sound through teeth',
      'Close mouth and hold breath',
      'Exhale slowly through nose',
      'Feel the cooling effect'
    ],
    customizable: true,
    difficulty: 'Beginner',
    duration: '5-10 min',
    pattern: '4-2-6-2',
    voiceGuidance: true
  },
  {
    id: 'three-part-breath',
    name: 'Dirga Pranayama (Three-Part Breath)',
    description: 'Complete yogic breathing using belly, ribs, and chest for full lung capacity.',
    benefits: ['Complete oxygenation', 'Stress relief', 'Lung capacity', 'Mind-body connection'],
    category: ['Pranayama', 'Health', 'Beginner'],
    defaultPattern: {
      inhale: 6,
      holdAfterInhale: 2,
      exhale: 6,
      holdAfterExhale: 2,
    },
    instructions: [
      'Lie down or sit comfortably',
      'Place one hand on belly, one on chest',
      'Inhale first into belly',
      'Then expand ribs sideways',
      'Finally fill upper chest',
      'Reverse the order while exhaling'
    ],
    customizable: true,
    difficulty: 'Beginner',
    duration: '5-15 min',
    pattern: '6-2-6-2',
    voiceGuidance: true
  },
  {
    id: 'meditation-breath',
    name: 'Meditation Breathing',
    description: 'Gentle, natural breathing for deep meditation and mindfulness practice.',
    benefits: ['Deep relaxation', 'Mindfulness', 'Stress reduction', 'Mental clarity'],
    category: ['Meditation', 'Relaxation', 'Beginner'],
    defaultPattern: {
      inhale: 4,
      holdAfterInhale: 0,
      exhale: 4,
      holdAfterExhale: 0
    },
    instructions: [
      'Find comfortable seated position',
      'Close eyes or soften gaze',
      'Breathe naturally through nose',
      'Focus attention on breath sensation',
      'Return to breath when mind wanders',
      'Continue for desired duration'
    ],
    customizable: true,
    difficulty: 'Beginner',
    duration: '10-30 min',
    pattern: '4-0-4-0',
    voiceGuidance: true
  },
  {
    id: 'wim-hof-basic',
    name: 'Wim Hof Method - Basic',
    description: 'Controlled hyperventilation followed by breath retention for improved stress resilience and energy.',
    benefits: ['Stress resilience', 'Energy boost', 'Immune system support', 'Mental clarity'],
    category: ['Energy', 'Advanced'],
    defaultPattern: {
      inhale: 2,
      holdAfterInhale: 0,
      exhale: 1,
      holdAfterExhale: 0,
      rounds: 30
    },
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
    customizable: false,
    difficulty: 'Advanced',
    duration: '15-20 min',
    pattern: '2-0-1-0',
    voiceGuidance: true
  }
];

export const getBreathingTechnique = (id: string): BreathingTechnique | undefined => {
  return breathingTechniques.find(technique => technique.id === id);
};

export const getBreathingTechniquesByCategory = (category: string): BreathingTechnique[] => {
  return breathingTechniques.filter(technique => technique.category.includes(category));
};
