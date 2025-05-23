
import { useState, useEffect } from "react";
import { Volume2, Play } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSoothingSound, soundConfigs } from "@/utils/audioUtils";
import type { SoundType } from "@/utils/audioUtils";

const SoundSettings = () => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundType, setSoundType] = useState<SoundType>('gentle-bells');

  useEffect(() => {
    const savedSound = localStorage.getItem('sereneflow-sound');
    const savedSoundType = localStorage.getItem('sereneflow-sound-type') as SoundType;
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
    if (savedSoundType) setSoundType(savedSoundType);
  }, []);

  const handleSoundToggle = (checked: boolean) => {
    setSoundEnabled(checked);
    localStorage.setItem('sereneflow-sound', checked.toString());
  };

  const handleSoundTypeChange = (value: SoundType) => {
    setSoundType(value);
    localStorage.setItem('sereneflow-sound-type', value);
  };

  const previewSound = () => {
    if (!soundEnabled) {
      return;
    }
    try {
      createSoothingSound(soundType, 'inhale');
    } catch (error) {
      console.log('Could not play sound:', error);
    }
  };

  // Use the actual sound types from audioUtils
  const soundOptions = Object.entries(soundConfigs)
    .filter(([key]) => key !== 'silent')
    .map(([key, config]) => ({
      value: key as SoundType,
      label: config.name
    }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <Label htmlFor="sound" className="text-slate-900 dark:text-slate-100 font-medium">
            Sound Feedback
          </Label>
        </div>
        <Switch id="sound" checked={soundEnabled} onCheckedChange={handleSoundToggle} />
      </div>
      
      {soundEnabled && (
        <div className="space-y-3 ml-6">
          <div>
            <Label className="text-sm text-slate-800 dark:text-slate-200 font-medium">Sound Type</Label>
            <Select value={soundType} onValueChange={handleSoundTypeChange}>
              <SelectTrigger className="mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                {soundOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-black dark:text-slate-100">
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
            className="w-full border-2 border-indigo-300 dark:border-indigo-600 font-medium bg-slate-500 hover:bg-slate-400 text-slate-950"
          >
            <Play className="h-4 w-4 mr-2" />
            Preview Sound
          </Button>
        </div>
      )}
    </div>
  );
};

export default SoundSettings;
