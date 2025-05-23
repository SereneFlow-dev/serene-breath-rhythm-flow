
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Heart, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import LoadingScreen from "@/components/LoadingScreen";
import CustomBreathingConfig from "@/components/CustomBreathingConfig";
import FeedbackSettings from "@/components/FeedbackSettings";
import { breathingTechniques } from "@/data/breathingTechniques";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [streak, setStreak] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load user stats from localStorage
    const savedStreak = localStorage.getItem('sereneflow-streak');
    const savedSessions = localStorage.getItem('sereneflow-total-sessions');
    
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedSessions) setTotalSessions(parseInt(savedSessions));
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleStartCustomSession = (config: any) => {
    // Store custom config in sessionStorage for the session page
    sessionStorage.setItem('custom-breathing-config', JSON.stringify(config));
    navigate('/session/custom');
  };

  const featuredTechniques = breathingTechniques.slice(0, 3);
  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : 
                  currentTime.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            SereneFlow
          </h1>
          <p className="text-slate-700 dark:text-slate-200 font-medium">{greeting}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Find your rhythm, master your breath
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-2 border-slate-200/80 dark:border-slate-700/80 shadow-xl">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-serene-teal mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{streak}</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">Day Streak</p>
            </CardContent>
          </Card>
          <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-2 border-slate-200/80 dark:border-slate-700/80 shadow-xl">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-serene-teal mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSessions}</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 font-medium">Sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <Card className="mb-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-2 border-slate-200/80 dark:border-slate-700/80 shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
              <Play className="h-5 w-5 mr-2 text-serene-teal" />
              Quick Start
            </h2>
            <Link to="/session/box-breathing">
              <Button className="w-full bg-serene-teal hover:bg-serene-teal/90 text-white font-semibold py-3 rounded-xl shadow-md transition-all">
                Start Box Breathing
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Custom Breathing Configuration */}
        <div className="mb-6">
          <CustomBreathingConfig onStartCustomSession={handleStartCustomSession} />
        </div>

        {/* Feedback Settings */}
        <div className="mb-6">
          <FeedbackSettings />
        </div>

        {/* Featured Techniques */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-serene-teal" />
            Featured Techniques
          </h2>
          <div className="space-y-3">
            {featuredTechniques.map((technique) => (
              <Link key={technique.id} to={`/session/${technique.id}`}>
                <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-2 border-slate-200/80 dark:border-slate-700/80 shadow-xl hover:shadow-2xl transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                          {technique.name}
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-2">
                          {technique.description}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs bg-serene-teal/20 text-serene-teal px-2 py-1 rounded-full font-medium border border-serene-teal/30">
                            {technique.difficulty}
                          </span>
                        </div>
                      </div>
                      <Play className="h-6 w-6 text-serene-teal ml-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Explore More */}
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-2 border-slate-200/80 dark:border-slate-700/80 shadow-xl">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Explore More Techniques
            </h3>
            <p className="text-slate-700 dark:text-slate-200 mb-4">
              Discover breathing exercises for every need
            </p>
            <Link to="/library">
              <Button variant="outline" className="border-2 border-serene-teal text-serene-teal hover:bg-serene-teal hover:text-white font-semibold transition-all">
                Browse Library
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Index;
