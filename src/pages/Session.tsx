
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, Square, ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import BreathingAnimation from "@/components/BreathingAnimation";
import { getBreathingTechnique } from "@/data/breathingTechniques";
import { toast } from "sonner";

type Phase = 'inhale' | 'hold-inhale' | 'exhale' | 'hold-exhale';

const Session = () => {
  const { technique: techniqueId } = useParams();
  const navigate = useNavigate();
  const technique = getBreathingTechnique(techniqueId || '');

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [sessionTime, setSessionTime] = useState(0);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0);

  // Customizable timings
  const [inhaleTime, setInhaleTime] = useState(4);
  const [holdInhaleTime, setHoldInhaleTime] = useState(4);
  const [exhaleTime, setExhaleTime] = useState(4);
  const [holdExhaleTime, setHoldExhaleTime] = useState(4);

  useEffect(() => {
    if (technique) {
      setInhaleTime(technique.defaultPattern.inhale);
      setHoldInhaleTime(technique.defaultPattern.holdAfterInhale);
      setExhaleTime(technique.defaultPattern.exhale);
      setHoldExhaleTime(technique.defaultPattern.holdAfterExhale);
    }
  }, [technique]);

  const getPhaseTimings = () => ({
    inhale: inhaleTime * 1000,
    'hold-inhale': holdInhaleTime * 1000,
    exhale: exhaleTime * 1000,
    'hold-exhale': holdExhaleTime * 1000,
  });

  const triggerHapticFeedback = useCallback((pattern: 'inhale' | 'hold' | 'exhale') => {
    if ('vibrate' in navigator) {
      switch (pattern) {
        case 'inhale':
          navigator.vibrate([50, 50, 100]); // Rising pattern
          break;
        case 'hold':
          navigator.vibrate(30); // Short pulse
          break;
        case 'exhale':
          navigator.vibrate([100, 30, 50]); // Falling pattern
          break;
      }
    }
  }, []);

  const nextPhase = useCallback(() => {
    const phases: Phase[] = ['inhale', 'hold-inhale', 'exhale', 'hold-exhale'];
    const currentIndex = phases.indexOf(currentPhase);
    const nextPhaseIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextPhaseIndex];

    setCurrentPhase(nextPhase);

    // Trigger haptic feedback
    if (nextPhase === 'inhale') {
      triggerHapticFeedback('inhale');
      if (currentIndex === 3) { // Completed a full cycle
        setCurrentCycle(prev => prev + 1);
      }
    } else if (nextPhase === 'exhale') {
      triggerHapticFeedback('exhale');
    } else {
      triggerHapticFeedback('hold');
    }

    const timings = getPhaseTimings();
    setPhaseTimeRemaining(timings[nextPhase]);
  }, [currentPhase, triggerHapticFeedback, getPhaseTimings]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 100);
        setPhaseTimeRemaining(prev => {
          if (prev <= 100) {
            nextPhase();
            return getPhaseTimings()[currentPhase];
          }
          return prev - 100;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, nextPhase, currentPhase, getPhaseTimings]);

  useEffect(() => {
    if (currentCycle >= totalCycles && isActive) {
      handleComplete();
    }
  }, [currentCycle, totalCycles, isActive]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentCycle(0);
    setSessionTime(0);
    setCurrentPhase('inhale');
    const timings = getPhaseTimings();
    setPhaseTimeRemaining(timings.inhale);
    triggerHapticFeedback('inhale');
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentCycle(0);
    setSessionTime(0);
    setCurrentPhase('inhale');
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsPaused(false);
    
    // Save session data
    const sessions = JSON.parse(localStorage.getItem('sereneflow-sessions') || '[]');
    const newSession = {
      id: Date.now(),
      technique: technique?.name,
      duration: Math.floor(sessionTime / 1000),
      cycles: currentCycle,
      date: new Date().toISOString(),
    };
    sessions.push(newSession);
    localStorage.setItem('sereneflow-sessions', JSON.stringify(sessions));

    // Update total sessions
    const totalSessions = parseInt(localStorage.getItem('sereneflow-total-sessions') || '0') + 1;
    localStorage.setItem('sereneflow-total-sessions', totalSessions.toString());

    toast.success("Session completed! Well done.");
    navigate('/');
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!technique) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Technique not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {technique.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isActive ? `Cycle ${currentCycle + 1} of ${totalCycles}` : 'Ready to start'}
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Session Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Total Cycles: {totalCycles}</Label>
                  <Slider
                    value={[totalCycles]}
                    onValueChange={(value) => setTotalCycles(value[0])}
                    min={1}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>
                {technique.customizable && (
                  <>
                    <div>
                      <Label>Inhale: {inhaleTime}s</Label>
                      <Slider
                        value={[inhaleTime]}
                        onValueChange={(value) => setInhaleTime(value[0])}
                        min={1}
                        max={12}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Hold (after inhale): {holdInhaleTime}s</Label>
                      <Slider
                        value={[holdInhaleTime]}
                        onValueChange={(value) => setHoldInhaleTime(value[0])}
                        min={0}
                        max={15}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Exhale: {exhaleTime}s</Label>
                      <Slider
                        value={[exhaleTime]}
                        onValueChange={(value) => setExhaleTime(value[0])}
                        min={1}
                        max={12}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Hold (after exhale): {holdExhaleTime}s</Label>
                      <Slider
                        value={[holdExhaleTime]}
                        onValueChange={(value) => setHoldExhaleTime(value[0])}
                        min={0}
                        max={15}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Session Stats */}
        <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-center">
              <div>
                <p className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                  {formatTime(sessionTime)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                  {Math.ceil(phaseTimeRemaining / 1000)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Phase Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breathing Animation */}
        <div className="flex-1 flex items-center justify-center min-h-[400px] mb-8">
          <BreathingAnimation
            phase={currentPhase}
            duration={phaseTimeRemaining}
            isActive={isActive && !isPaused}
          />
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <Button
              onClick={handleStart}
              className="bg-serene-teal hover:bg-serene-teal/90 text-white px-8 py-3 rounded-xl"
            >
              <Play className="h-5 w-5 mr-2" />
              Start
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePause}
                variant="outline"
                className="border-serene-teal text-serene-teal px-6 py-3 rounded-xl"
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </Button>
              <Button
                onClick={handleStop}
                variant="outline"
                className="border-red-400 text-red-600 px-6 py-3 rounded-xl"
              >
                <Square className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Session;
