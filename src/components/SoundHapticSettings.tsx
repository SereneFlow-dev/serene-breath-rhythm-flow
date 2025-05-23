
import { useState, useEffect } from "react";
import { Volume2, Smartphone, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { soundConfigs, hapticPatterns, createSoothingSound, triggerHapticPattern } from "@/utils/audioUtils";
import type { SoundType, HapticPattern } from "@/utils/audioUtils";
import { toast } from "sonner";

const SoundHapticSettings = () => {
  const [selectedSound, setSelectedSound] = useState<SoundType>('gentle-bells');
  const [selectedHaptic, setSelectedHaptic] = useState<HapticPattern>('gentle');

  useEffect(() => {
    const savedSound = localStorage.getItem('sereneflow-sound-type') as SoundType;
    const savedHaptic = localStorage.getItem('sereneflow-haptic-pattern') as HapticPattern;
    
    if (savedSound && soundConfigs[savedSound]) setSelectedSound(savedSound);
    if (savedHaptic && hapticPatterns[savedHaptic]) setSelectedHaptic(savedHaptic);
  }, []);

  const handleSoundChange = (sound: SoundType) => {
    setSelectedSound(sound);
    localStorage.setItem('sereneflow-sound-type', sound);
    localStorage.setItem('sereneflow-sound', sound === 'silent' ? 'false' : 'true');
    toast.success(`Sound changed to ${soundConfigs[sound].name}`);
  };

  const handleHapticChange = (haptic: HapticPattern) => {
    setSelectedHaptic(haptic);
    localStorage.setItem('sereneflow-haptic-pattern', haptic);
    localStorage.setItem('sereneflow-haptic', haptic === 'off' ? 'false' : 'true');
    toast.success(`Haptic pattern changed to ${hapticPatterns[haptic].name}`);
  };

  const previewSound = () => {
    if (selectedSound !== 'silent') {
      createSoothingSound(selectedSound, 'inhale');
      toast.info("Playing sound preview");
    }
  };

  const previewHaptic = () => {
    if (selectedHaptic !== 'off') {
      triggerHapticPattern(selectedHaptic);
      toast.info("Testing haptic pattern");
    }
  };

  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-2 border-slate-200/80 dark:border-slate-700/80 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
          Feedback Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sound Settings */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <Label className="text-slate-800 dark:text-slate-100 font-medium">
              Sound Type
            </Label>
          </div>
          <Select value={selectedSound} onValueChange={handleSoundChange}>
            <SelectTrigger className="bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600">
              {Object.entries(soundConfigs).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div>
                    <div className="font-medium">{config.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{config.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSound !== 'silent' && (
            <Button
              variant="outline"
              size="sm"
              onClick={previewSound}
              className="w-full border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
            >
              <Play className="h-3 w-3 mr-2" />
              Preview Sound
            </Button>
          )}
        </div>

        {/* Haptic Settings */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <Label className="text-slate-800 dark:text-slate-100 font-medium">
              Haptic Pattern
            </Label>
          </div>
          <Select value={selectedHaptic} onValueChange={handleHapticChange}>
            <SelectTrigger className="bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600">
              {Object.entries(hapticPatterns).map(([key, pattern]) => (
                <SelectItem key={key} value={key}>
                  <div>
                    <div className="font-medium">{pattern.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{pattern.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedHaptic !== 'off' && (
            <Button
              variant="outline"
              size="sm"
              onClick={previewHaptic}
              className="w-full border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
            >
              <Smartphone className="h-3 w-3 mr-2" />
              Test Haptic
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SoundHapticSettings;
