
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, Square, ArrowLeft, Settings as SettingsIcon, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreathingAnimation from "@/components/BreathingAnimation";
import { getBreathingTechnique } from "@/data/breathingTechniques";
import { createSoothingSound, triggerHapticPattern } from "@/utils/audioUtils";
import type { SoundType, HapticPattern } from "@/utils/audioUtils";
import { toast } from "sonner";

type Phase = 'inhale' | 'hold-inhale' | 'exhale' | 'hold-exhale';

const Session = () => {
  const { technique: techniqueId } = useParams();
  const navigate = useNavigate();
  const technique = getBreathingTechnique(techniqueId || '');

  // Check for custom breathing config
  const customConfig = techniqueId === 'custom' ? JSON.parse(sessionStorage.getItem('custom-breathing-config') || '{}') : null;

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(customConfig?.cycles || 5);
  const [sessionTime, setSessionTime] = useState(0);
  const [phaseTimeRemaining, setPhaseTimeRemaining] = useState(0);

  // Customizable timings
  const [inhaleTime, setInhaleTime] = useState(customConfig?.inhale || 4);
  const [holdInhaleTime, setHoldInhaleTime] = useState(customConfig?.holdInhale || 4);
  const [exhaleTime, setExhaleTime] = useState(customConfig?.exhale || 4);
  const [holdExhaleTime, setHoldExhaleTime] = useState(customConfig?.holdExhale || 4);

  // Custom breathing pattern
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    if (technique && !customConfig) {
      setInhaleTime(technique.defaultPattern.inhale);
      setHoldInhaleTime(technique.defaultPattern.holdAfterInhale);
      setExhaleTime(technique.defaultPattern.exhale);
      setHoldExhaleTime(technique.defaultPattern.holdAfterExhale);
    }
  }, [technique, customConfig]);

  const adjustValue = (currentValue: number, adjustment: number, min: number, max: number) => {
    const newValue = currentValue + adjustment;
    return Math.max(min, Math.min(max, newValue));
  };

  const getPhaseTimings = () => ({
    inhale: inhaleTime * 1000,
    'hold-inhale': holdInhaleTime * 1000,
    exhale: exhaleTime * 1000,
    'hold-exhale': holdExhaleTime * 1000,
  });

  const playPhaseSound = useCallback((phase: Phase) => {
    const soundEnabled = localStorage.getItem('sereneflow-sound') === 'true';
    if (!soundEnabled) return;

    const soundType = (localStorage.getItem('sereneflow-sound-type') as SoundType) || 'gentle-bells';
    createSoothingSound(soundType, phase);
  }, []);

  const triggerHapticFeedback = useCallback((pattern: 'inhale' | 'hold' | 'exhale') => {
    const hapticEnabled = localStorage.getItem('sereneflow-haptic') !== 'false';
    if (!hapticEnabled) return;

    const hapticPattern = (localStorage.getItem('sereneflow-haptic-pattern') as HapticPattern) || 'gentle';
    
    if (pattern === 'inhale' || pattern === 'exhale') {
      triggerHapticPattern(hapticPattern);
    } else {
      triggerHapticPattern('subtle');
    }
  }, []);

  const nextPhase = useCallback(() => {
    const phases: Phase[] = ['inhale', 'hold-inhale', 'exhale', 'hold-exhale'];
    const currentIndex = phases.indexOf(currentPhase);
    const nextPhaseIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextPhaseIndex];

    setCurrentPhase(nextPhase);

    // Trigger feedback
    if (nextPhase === 'inhale') {
      triggerHapticFeedback('inhale');
      playPhaseSound('inhale');
      if (currentIndex === 3) { // Completed a full cycle
        setCurrentCycle(prev => prev + 1);
      }
    } else if (nextPhase === 'exhale') {
      triggerHapticFeedback('exhale');
      playPhaseSound('exhale');
    } else {
      triggerHapticFeedback('hold');
      playPhaseSound(nextPhase);
    }

    const timings = getPhaseTimings();
    setPhaseTimeRemaining(timings[nextPhase]);
  }, [currentPhase, triggerHapticFeedback, playPhaseSound, getPhaseTimings]);

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
    playPhaseSound('inhale');
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
      technique: customConfig?.name || technique?.name,
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

  const saveCustomPattern = () => {
    if (!customName.trim()) {
      toast.error("Please enter a name for your custom pattern");
      return;
    }

    const customPatterns = JSON.parse(localStorage.getItem('sereneflow-custom-patterns') || '[]');
    const newPattern = {
      id: `custom-${Date.now()}`,
      name: customName,
      inhale: inhaleTime,
      holdInhale: holdInhaleTime,
      exhale: exhaleTime,
      holdExhale: holdExhaleTime,
      created: new Date().toISOString()
    };

    customPatterns.push(newPattern);
    localStorage.setItem('sereneflow-custom-patterns', JSON.stringify(customPatterns));
    toast.success("Custom breathing pattern saved!");
    setCustomName("");
  };

  if (!technique && !customConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Technique not found</h1>
          <Button onClick={() => navigate('/')} className="bg-serene-teal hover:bg-serene-teal/90 text-white font-semibold">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const displayName = customConfig?.name || technique?.name || 'Custom Breathing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-3 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-md"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </Button>
          
          <div className="text-center flex-1 mx-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {displayName}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              {isActive ? `Cycle ${currentCycle + 1} of ${totalCycles}` : 'Ready to start'}
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-3 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-md">
                <SettingsIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-slate-900 dark:text-white">Session Settings</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="settings" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-700">
                  <TabsTrigger value="settings" className="text-slate-700 dark:text-slate-200">Settings</TabsTrigger>
                  <TabsTrigger value="custom" className="text-slate-700 dark:text-slate-200">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="settings" className="space-y-4">
                  {/* Total Cycles */}
                  <div>
                    <Label className="text-slate-700 dark:text-slate-200 font-medium mb-2 block">
                      Total Cycles: {totalCycles}
                    </Label>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setTotalCycles(adjustValue(totalCycles, -1, 1, 20))}
                        className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded">
                        <div 
                          className="h-full bg-indigo-600 rounded transition-all"
                          style={{ width: `${(totalCycles / 20) * 100}%` }}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setTotalCycles(adjustValue(totalCycles, 1, 1, 20))}
                        className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {(technique?.customizable || customConfig) && (
                    <>
                      {/* Inhale Time */}
                      <div>
                        <Label className="text-slate-700 dark:text-slate-200 font-medium mb-2 block">
                          Inhale: {inhaleTime}s
                        </Label>
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setInhaleTime(adjustValue(inhaleTime, -0.5, 1, 12))}
                            className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded">
                            <div 
                              className="h-full bg-indigo-600 rounded transition-all"
                              style={{ width: `${(inhaleTime / 12) * 100}%` }}
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setInhaleTime(adjustValue(inhaleTime, 0.5, 1, 12))}
                            className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Hold After Inhale */}
                      <div>
                        <Label className="text-slate-700 dark:text-slate-200 font-medium mb-2 block">
                          Hold (after inhale): {holdInhaleTime}s
                        </Label>
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setHoldInhaleTime(adjustValue(holdInhaleTime, -0.5, 0, 15))}
                            className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded">
                            <div 
                              className="h-full bg-indigo-600 rounded transition-all"
                              style={{ width: `${(holdInhaleTime / 15) * 100}%` }}
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setHoldInhaleTime(adjustValue(holdInhaleTime, 0.5, 0, 15))}
                            className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Exhale Time */}
                      <div>
                        <Label className="text-slate-700 dark:text-slate-200 font-medium mb-2 block">
                          Exhale: {exhaleTime}s
                        </Label>
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExhaleTime(adjustValue(exhaleTime, -0.5, 1, 12))}
                            className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded">
                            <div 
                              className="h-full bg-indigo-600 rounded transition-all"
                              style={{ width: `${(exhaleTime / 12) * 100}%` }}
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExhaleTime(adjustValue(exhaleTime, 0.5, 1, 12))}
                            className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Hold After Exhale */}
                      <div>
                        <Label className="text-slate-700 dark:text-slate-200 font-medium mb-2 block">
                          Hold (after exhale): {holdExhaleTime}s
                        </Label>
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setHoldExhaleTime(adjustValue(holdExhaleTime, -0.5, 0, 15))}
                            className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded">
                            <div 
                              className="h-full bg-indigo-600 rounded transition-all"
                              style={{ width: `${(holdExhaleTime / 15) * 100}%` }}
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setHoldExhaleTime(adjustValue(holdExhaleTime, 0.5, 0, 15))}
                            className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>
                <TabsContent value="custom" className="space-y-4">
                  <div>
                    <Label className="text-slate-700 dark:text-slate-200">Pattern Name</Label>
                    <Input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="My Custom Pattern"
                      className="mt-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Custom pattern controls with +/- buttons */}
                  <div>
                    <Label className="text-slate-700 dark:text-slate-200 font-medium mb-2 block">
                      Inhale: {inhaleTime}s
                    </Label>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setInhaleTime(adjustValue(inhaleTime, -0.5, 1, 12))}
                        className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded">
                        <div 
                          className="h-full bg-indigo-600 rounded transition-all"
                          style={{ width: `${(inhaleTime / 12) * 100}%` }}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setInhaleTime(adjustValue(inhaleTime, 0.5, 1, 12))}
                        className="h-8 w-8 p-0 border-2 border-indigo-300 dark:border-indigo-600"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* ... similar blocks for hold-inhale, exhale, hold-exhale ... */}

                  <Button onClick={saveCustomPattern} className="w-full bg-serene-teal hover:bg-serene-teal/90 text-white font-semibold">
                    <Plus className="h-4 w-4 mr-2" />
                    Save Custom Pattern
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Session Stats */}
        <Card className="mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-center">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatTime(sessionTime)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Duration</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.ceil(phaseTimeRemaining / 1000)}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Phase Time</p>
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
              className="bg-serene-teal hover:bg-serene-teal/90 text-white font-bold px-8 py-4 rounded-xl shadow-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePause}
                variant="outline"
                className="border-2 border-serene-teal text-serene-teal hover:bg-serene-teal hover:text-white font-bold px-6 py-4 rounded-xl shadow-lg bg-white dark:bg-slate-800"
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </Button>
              <Button
                onClick={handleStop}
                variant="outline"
                className="border-2 border-red-400 text-red-600 hover:bg-red-500 hover:text-white font-bold px-6 py-4 rounded-xl shadow-lg bg-white dark:bg-slate-800"
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
