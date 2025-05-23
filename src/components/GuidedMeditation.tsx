
import { useState, useEffect, useCallback } from "react";
import { Play, Pause, Square, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface GuidedMeditationProps {
  technique: {
    id: string;
    name: string;
    description: string;
    instructions: string[];
    duration: string;
    voiceGuidance?: boolean;
  };
  onComplete?: () => void;
}

const GuidedMeditation = ({ technique, onComplete }: GuidedMeditationProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState([1]);
  const [selectedVoice, setSelectedVoice] = useState('default');

  const voices = [
    { id: 'default', name: 'Default Voice', gender: 'neutral' },
    { id: 'female-calm', name: 'Calm Female', gender: 'female' },
    { id: 'male-deep', name: 'Deep Male', gender: 'male' },
    { id: 'female-warm', name: 'Warm Female', gender: 'female' }
  ];

  const speakInstruction = useCallback((text: string) => {
    if (!voiceEnabled || !technique.voiceGuidance) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSpeed[0];
      utterance.pitch = selectedVoice.includes('female') ? 1.2 : 0.8;
      utterance.volume = 0.8;
      
      window.speechSynthesis.speak(utterance);
    }
  }, [voiceEnabled, voiceSpeed, selectedVoice, technique.voiceGuidance]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setCurrentStep(0);
    setSessionTime(0);
    
    toast.success("Starting guided meditation");
    speakInstruction(`Welcome to ${technique.name}. Let's begin with the first instruction.`);
    
    setTimeout(() => {
      speakInstruction(technique.instructions[0]);
    }, 2000);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      window.speechSynthesis.pause();
    } else {
      window.speechSynthesis.resume();
    }
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setCurrentStep(0);
    setSessionTime(0);
    window.speechSynthesis.cancel();
  };

  const handleNextStep = () => {
    if (currentStep < technique.instructions.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      speakInstruction(technique.instructions[nextStep]);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsPaused(false);
    window.speechSynthesis.cancel();
    
    speakInstruction("Wonderful! You have completed this guided meditation session.");
    toast.success("Meditation session completed!");
    
    if (onComplete) {
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
            {technique.name}
          </CardTitle>
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
            {technique.duration}
          </Badge>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {technique.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Voice Settings */}
        {technique.voiceGuidance && (
          <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Voice Guidance</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="h-8 w-8 p-0"
              >
                {voiceEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {voiceEnabled && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Voice Selection
                  </label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Speech Speed: {voiceSpeed[0]}x
                  </label>
                  <Slider
                    value={voiceSpeed}
                    onValueChange={setVoiceSpeed}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Current Instruction */}
        <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            Step {currentStep + 1} of {technique.instructions.length}
          </div>
          <p className="text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
            {technique.instructions[currentStep] || "Ready to begin your guided meditation"}
          </p>
        </div>

        {/* Session Info */}
        <div className="flex justify-between items-center text-center">
          <div>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatTime(sessionTime)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Duration</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {currentStep + 1}/{technique.instructions.length}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Progress</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <Button
              onClick={handleStart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Meditation
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePause}
                variant="outline"
                className="border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              >
                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
              </Button>
              
              {currentStep < technique.instructions.length - 1 && (
                <Button
                  onClick={handleNextStep}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Next Step
                </Button>
              )}
              
              <Button
                onClick={handleStop}
                variant="outline"
                className="border-2 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Square className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuidedMeditation;
