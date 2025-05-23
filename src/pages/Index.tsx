
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import BreathingAnimation from "@/components/BreathingAnimation";
import CustomBreathingConfig from "@/components/CustomBreathingConfig";
import { breathingTechniques } from "@/data/breathingTechniques";
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
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {getGreeting() && (
            <p className="text-muted-foreground mb-2 font-medium">
              {getGreeting()}
            </p>
          )}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            SereneFlow
          </h1>
          <p className="text-muted-foreground font-medium">
            Find your calm through mindful breathing
          </p>
        </div>

        {/* Breathing Animation */}
        <div className="flex justify-center mb-8">
          <BreathingAnimation />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-card backdrop-blur-sm border-2 border-border shadow-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{totalSessions}</p>
              <p className="text-sm text-muted-foreground font-medium">Total Sessions</p>
            </CardContent>
          </Card>
          <Card className="bg-card backdrop-blur-sm border-2 border-border shadow-xl">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{currentStreak}</p>
              <p className="text-sm text-muted-foreground font-medium">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        {/* Custom Breathing Pattern */}
        <div className="mb-8">
          <CustomBreathingConfig onStartCustomSession={handleCustomSession} />
        </div>

        {/* Quick Start */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Quick Start
          </h2>
          <div className="space-y-4">
            {breathingTechniques.slice(0, 3).map((technique) => (
              <Card 
                key={technique.id}
                className="bg-card backdrop-blur-sm border-2 border-border shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => handleTechniqueSelect(technique)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-card-foreground">
                          {technique.name}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className="bg-secondary text-secondary-foreground border-border"
                        >
                          {technique.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {technique.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Difficulty: {technique.difficulty}</span>
                        <span>•</span>
                        <span>{technique.pattern}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary ml-4" />
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
          className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
        >
          View All Techniques
        </Button>
      </div>

      <Navigation />
    </div>
  );
};

export default Index;
