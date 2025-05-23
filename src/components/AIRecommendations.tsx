
import { useState, useEffect } from "react";
import { Brain, Sparkles, TrendingUp, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { breathingTechniques } from "@/data/breathingTechniques";
import { advancedBreathingTechniques } from "@/data/advancedBreathingTechniques";
import { toast } from "sonner";

interface UserProfile {
  totalSessions: number;
  preferredTechniques: string[];
  stressLevels: number[];
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  goals: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
}

interface Recommendation {
  id: string;
  type: 'technique' | 'schedule' | 'goal' | 'improvement';
  title: string;
  description: string;
  confidence: number;
  technique?: any;
  action: string;
  reasoning: string;
}

const AIRecommendations = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    analyzeUserData();
  }, []);

  const analyzeUserData = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Gather user data from localStorage
    const totalSessions = parseInt(localStorage.getItem('sereneflow-total-sessions') || '0');
    const sessions = JSON.parse(localStorage.getItem('sereneflow-sessions') || '[]');
    const stressEntries = JSON.parse(localStorage.getItem('sereneflow-stress-entries') || '[]');
    
    // Analyze user patterns
    const preferredTechniques = sessions.reduce((acc: Record<string, number>, session: any) => {
      acc[session.technique] = (acc[session.technique] || 0) + 1;
      return acc;
    }, {});
    
    const sortedTechniques = Object.entries(preferredTechniques)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .map(([technique]) => technique);
    
    const avgStressLevels = stressEntries.map((entry: any) => entry.preSessionStress);
    
    // Determine experience level
    let experience: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (totalSessions > 50) experience = 'advanced';
    else if (totalSessions > 20) experience = 'intermediate';
    
    // Determine preferred time (simplified)
    const currentHour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' = 'morning';
    if (currentHour >= 12 && currentHour < 17) timeOfDay = 'afternoon';
    else if (currentHour >= 17) timeOfDay = 'evening';
    
    const profile: UserProfile = {
      totalSessions,
      preferredTechniques: sortedTechniques.slice(0, 3),
      stressLevels: avgStressLevels,
      timeOfDay,
      goals: ['stress-reduction', 'better-sleep'], // Simplified
      experience
    };
    
    setUserProfile(profile);
    generateRecommendations(profile);
    setIsAnalyzing(false);
  };

  const generateRecommendations = (profile: UserProfile) => {
    const recs: Recommendation[] = [];
    
    // Technique recommendations based on experience
    if (profile.experience === 'beginner') {
      recs.push({
        id: 'beginner-technique',
        type: 'technique',
        title: 'Try 4-7-8 Breathing',
        description: 'Perfect for beginners looking to improve sleep and relaxation',
        confidence: 95,
        technique: breathingTechniques.find(t => t.id === '4-7-8-breathing'),
        action: 'Start Session',
        reasoning: 'Based on your session history, this technique aligns with stress reduction goals'
      });
    } else if (profile.experience === 'intermediate') {
      recs.push({
        id: 'intermediate-technique',
        type: 'technique',
        title: 'Explore Alternate Nostril Breathing',
        description: 'Ready for more advanced techniques to balance your energy',
        confidence: 88,
        technique: breathingTechniques.find(t => t.id === 'alternate-nostril'),
        action: 'Try Technique',
        reasoning: 'Your consistent practice suggests readiness for energy-balancing techniques'
      });
    } else {
      recs.push({
        id: 'advanced-technique',
        type: 'technique',
        title: 'Master Wim Hof Method',
        description: 'Advanced technique for stress resilience and energy',
        confidence: 92,
        technique: advancedBreathingTechniques.find(t => t.id === 'wim-hof-basic'),
        action: 'Start Advanced Session',
        reasoning: 'Your expertise level qualifies you for this powerful breathing method'
      });
    }
    
    // Schedule recommendations
    if (profile.timeOfDay === 'morning') {
      recs.push({
        id: 'morning-schedule',
        type: 'schedule',
        title: 'Morning Energizing Routine',
        description: 'Start your day with energizing breathing exercises',
        confidence: 85,
        action: 'Set Reminder',
        reasoning: 'Your session times suggest you prefer morning practice'
      });
    } else if (profile.timeOfDay === 'evening') {
      recs.push({
        id: 'evening-schedule',
        type: 'schedule',
        title: 'Evening Wind-Down',
        description: 'Relaxing breathing routine before bedtime',
        confidence: 90,
        action: 'Create Routine',
        reasoning: 'Evening sessions can significantly improve sleep quality'
      });
    }
    
    // Goal-based recommendations
    if (profile.stressLevels.length > 0) {
      const avgStress = profile.stressLevels.reduce((a, b) => a + b, 0) / profile.stressLevels.length;
      if (avgStress > 6) {
        recs.push({
          id: 'stress-goal',
          type: 'goal',
          title: 'Focus on Stress Reduction',
          description: 'Prioritize calming techniques to lower your stress levels',
          confidence: 93,
          action: 'View Stress Plan',
          reasoning: 'Your stress assessments show room for improvement with targeted techniques'
        });
      }
    }
    
    // Improvement suggestions
    if (profile.totalSessions < 10) {
      recs.push({
        id: 'consistency-improvement',
        type: 'improvement',
        title: 'Build a Daily Habit',
        description: 'Aim for 5-10 minutes of breathing practice daily',
        confidence: 87,
        action: 'Set Daily Goal',
        reasoning: 'Consistency is key to experiencing the full benefits of breathing exercises'
      });
    }
    
    setRecommendations(recs);
  };

  const handleRecommendationAction = (rec: Recommendation) => {
    switch (rec.type) {
      case 'technique':
        if (rec.technique) {
          // Navigate to technique session
          toast.success(`Starting ${rec.technique.name} session`);
        }
        break;
      case 'schedule':
        toast.success('Reminder set! We\'ll notify you at your preferred time');
        break;
      case 'goal':
        toast.success('Goal updated in your profile');
        break;
      case 'improvement':
        toast.success('Daily practice goal added to your plan');
        break;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'technique': return <Target className="h-5 w-5 text-blue-600" />;
      case 'schedule': return <Clock className="h-5 w-5 text-green-600" />;
      case 'goal': return <TrendingUp className="h-5 w-5 text-purple-600" />;
      case 'improvement': return <Sparkles className="h-5 w-5 text-yellow-600" />;
      default: return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (isAnalyzing) {
    return (
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardContent className="p-8 text-center">
          <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            Analyzing Your Practice
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Our AI is reviewing your breathing sessions and stress patterns to create personalized recommendations...
          </p>
          <div className="w-full max-w-xs mx-auto">
            <Progress value={75} className="h-2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          AI Recommendations
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Personalized suggestions based on your breathing practice and wellness goals
        </p>
      </div>

      {/* User Profile Summary */}
      {userProfile && (
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-indigo-600" />
              Your Profile Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {userProfile.totalSessions}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 capitalize">
                  {userProfile.experience}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Level</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 capitalize">
                  {userProfile.timeOfDay}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Preferred Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {recommendations.length}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getRecommendationIcon(rec.type)}
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {rec.title}
                    </h3>
                    <Badge className={`${getConfidenceColor(rec.confidence)} bg-transparent border`}>
                      {rec.confidence}% match
                    </Badge>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-3">
                    {rec.description}
                  </p>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    {rec.reasoning}
                  </p>
                </div>
                
                <Button
                  onClick={() => handleRecommendationAction(rec)}
                  className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {rec.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && !isAnalyzing && (
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              Start Your Practice
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Complete a few breathing sessions to receive personalized AI recommendations.
            </p>
            <Button
              onClick={analyzeUserData}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Refresh Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIRecommendations;
