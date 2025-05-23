
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
  };
  instructions: string[];
  customizable: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
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
  },
  {
    id: 'alternate-nostril',
    name: 'Alternate Nostril Breathing',
    description: 'Breathing through alternating nostrils to balance energy and calm the nervous system.',
    benefits: ['Energy balance', 'Nervous system calm', 'Improved focus', 'Mental clarity'],
    category: ['Focus', 'Energy', 'Intermediate'],
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
  },
];

export const getBreathingTechnique = (id: string): BreathingTechnique | undefined => {
  return breathingTechniques.find(technique => technique.id === id);
};

export const getBreathingTechniquesByCategory = (category: string): BreathingTechnique[] => {
  return breathingTechniques.filter(technique => technique.category.includes(category));
};
