import { useState, useEffect } from "react";
import { Volume2, Smartphone, Play, TestTube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSoothingSound, triggerHapticPattern } from "@/utils/audioUtils";
import type { SoundType, HapticPattern } from "@/utils/audioUtils";
import { toast } from "sonner";

const SoundHapticSettings = () => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [soundType, setSoundType] = useState<SoundType>('gentle-bells');
  const [hapticPattern, setHapticPattern] = useState<HapticPattern>('gentle');

  useEffect(() => {
    const savedSound = localStorage.getItem('sereneflow-sound');
    const savedHaptic = localStorage.getItem('sereneflow-haptic');
    const savedSoundType = localStorage.getItem('sereneflow-sound-type') as SoundType;
    const savedHapticPattern = localStorage.getItem('sereneflow-haptic-pattern') as HapticPattern;
    
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
    if (savedHaptic !== null) setHapticEnabled(savedHaptic !== 'false');
    if (savedSoundType) setSoundType(savedSoundType);
    if (savedHapticPattern) setHapticPattern(savedHapticPattern);
  }, []);

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    localStorage.setItem('sereneflow-sound', checked.toString());
    
    if (checked) {
      toast.success("Sound feedback enabled");
    } else {
      toast.info("Sound feedback disabled");
    }
  };

  const handleHapticToggle = (checked: boolean) => {
    setHapticEnabled(checked);
    localStorage.setItem('sereneflow-haptic', checked.toString());
    
    if (checked && 'vibrate' in navigator) {
      try {
        navigator.vibrate(100);
        toast.success("Haptic feedback enabled");
      } catch (error) {
        console.log('Vibration not supported');
        toast.error("Vibration not supported on this device");
      }
    } else if (!checked) {
      toast.info("Haptic feedback disabled");
    }
  };

  const handleSoundTypeChange = (value: SoundType) => {
    setSoundType(value);
    localStorage.setItem('sereneflow-sound-type', value);
  };

  const handleHapticPatternChange = (value: HapticPattern) => {
    setHapticPattern(value);
    localStorage.setItem('sereneflow-haptic-pattern', value);
  };

  const previewSound = () => {
    if (!soundEnabled) {
      toast.error("Please enable sound feedback first");
      return;
    }
    
    try {
      createSoothingSound(soundType, 'inhale');
      toast.success("Playing sound preview");
    } catch (error) {
      toast.error("Could not play sound");
    }
  };

  const testHaptic = () => {
    if (!hapticEnabled) {
      toast.error("Please enable haptic feedback first");
      return;
    }
    
    try {
      triggerHapticPattern(hapticPattern);
      toast.success("Haptic feedback triggered");
    } catch (error) {
      toast.error("Could not trigger haptic feedback");
    }
  };

  const soundOptions = [
    { value: 'gentle-bells', label: 'Gentle Bells' },
    { value: 'ocean-waves', label: 'Ocean Waves' },
    { value: 'forest-rain', label: 'Forest Rain' },
    { value: 'singing-bowl', label: 'Singing Bowl' },
    { value: 'wind-chimes', label: 'Wind Chimes' }
  ];

  const hapticOptions = [
    { value: 'gentle', label: 'Gentle' },
    { value: 'medium', label: 'Medium' },
    { value: 'strong', label: 'Strong' },
    { value: 'subtle', label: 'Subtle' },
    { value: 'rhythmic', label: 'Rhythmic' }
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center text-slate-900 dark:text-slate-100">
          Feedback Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sound Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <Label htmlFor="sound" className="text-slate-900 dark:text-slate-100 font-medium">
                Sound Feedback
              </Label>
            </div>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={handleSoundToggle}
            />
          </div>
          
          {soundEnabled && (
            <div className="space-y-3 ml-6">
              <div>
                <Label className="text-sm text-slate-800 dark:text-slate-200 font-medium">Sound Type</Label>
                <Select value={soundType} onValueChange={handleSoundTypeChange}>
                  <SelectTrigger className="mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {soundOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={previewSound}
                variant="outline"
                size="sm"
                className="w-full border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-200 dark:hover:bg-indigo-900/30 font-medium"
              >
                <Play className="h-4 w-4 mr-2" />
                Preview Sound
              </Button>
            </div>
          )}
        </div>

        {/* Haptic Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <Label htmlFor="haptic" className="text-slate-900 dark:text-slate-100 font-medium">
                Haptic Feedback
              </Label>
            </div>
            <Switch
              id="haptic"
              checked={hapticEnabled}
              onCheckedChange={handleHapticToggle}
            />
          </div>
          
          {hapticEnabled && (
            <div className="space-y-3 ml-6">
              <div>
                <Label className="text-sm text-slate-800 dark:text-slate-200 font-medium">Haptic Pattern</Label>
                <Select value={hapticPattern} onValueChange={handleHapticPatternChange}>
                  <SelectTrigger className="mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hapticOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={testHaptic}
                variant="outline"
                size="sm"
                className="w-full border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-200 dark:hover:bg-indigo-900/30 font-medium"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Haptic
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundHapticSettings;
