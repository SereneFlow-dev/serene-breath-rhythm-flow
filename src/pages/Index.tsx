
import { useState, useEffect } from "react";
import { ArrowRight, Brain, Gamepad2, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import BreathingAnimation from "@/components/BreathingAnimation";
import CustomBreathingConfig from "@/components/CustomBreathingConfig";
import GuidedMeditation from "@/components/GuidedMeditation";
import BreathingGames from "@/components/BreathingGames";
import StressTracking from "@/components/StressTracking";
import AIRecommendations from "@/components/AIRecommendations";
import { breathingTechniques } from "@/data/breathingTechniques";
import { advancedBreathingTechniques } from "@/data/advancedBreathingTechniques";
import { toast } from "sonner";

const Index = () => {
  const [totalSessions, setTotalSessions] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user stats
    const sessions = localStorage.getItem('sereneflow-total-sessions');
    const streak = localStorage.getItem('sereneflow-streak');
    
    if (sessions) setTotalSessions(parseInt(sessions));
    if (streak) setCurrentStreak(parseInt(streak));
  }, []);

  const handleTechniqueSelect = (technique: any) => {
    navigate(`/session/${technique.id}`, { state: { technique } });
  };

  const handleCustomSession = (config: any) => {
    navigate('/session/custom', { state: { technique: config } });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return ""; // Removed "Good Evening" as requested
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {getGreeting() && (
            <p className="text-slate-600 dark:text-slate-300 mb-2 font-medium">
              {getGreeting()}
            </p>
          )}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            SereneFlow
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Find your calm through mindful breathing
          </p>
        </div>

        {/* Breathing Animation */}
        <div className="flex justify-center mb-8">
          <BreathingAnimation />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalSessions}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Sessions</p>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{currentStreak}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">AI Coach</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>AI Recommendations</DialogTitle>
              </DialogHeader>
              <AIRecommendations />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Gamepad2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Games</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Breathing Games</DialogTitle>
              </DialogHeader>
              <BreathingGames />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Stress Track</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Stress Tracking</DialogTitle>
              </DialogHeader>
              <StressTracking />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Sparkles className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Guided</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Guided Meditations</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Techniques</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  {breathingTechniques.slice(0, 3).map((technique) => (
                    <GuidedMeditation
                      key={technique.id}
                      technique={technique}
                      onComplete={() => toast.success("Meditation completed!")}
                    />
                  ))}
                </TabsContent>
                <TabsContent value="advanced" className="space-y-4">
                  {advancedBreathingTechniques.map((technique) => (
                    <GuidedMeditation
                      key={technique.id}
                      technique={technique}
                      onComplete={() => toast.success("Advanced session completed!")}
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Custom Breathing Pattern */}
        <div className="mb-8">
          <CustomBreathingConfig onStartCustomSession={handleCustomSession} />
        </div>

        {/* Quick Start */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Quick Start
          </h2>
          <div className="space-y-4">
            {breathingTechniques.slice(0, 3).map((technique) => (
              <Card 
                key={technique.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => handleTechniqueSelect(technique)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {technique.name}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700"
                        >
                          {technique.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                        {technique.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>Difficulty: {technique.difficulty}</span>
                        <span>•</span>
                        <span>{technique.pattern}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-indigo-600 dark:text-indigo-400 ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* View All Techniques */}
        <Button 
          onClick={() => navigate('/library')}
          variant="outline" 
          className="w-full border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/30 font-semibold"
        >
          View All Techniques
        </Button>
      </div>

      <Navigation />
    </div>
  );
};

export default Index;
