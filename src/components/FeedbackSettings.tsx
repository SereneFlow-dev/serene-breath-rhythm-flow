
import { useState, useEffect } from "react";
import { Smartphone, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const FeedbackSettings = () => {
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const savedHaptic = localStorage.getItem('sereneflow-haptic');
    const savedSound = localStorage.getItem('sereneflow-sound');
    
    if (savedHaptic !== null) setHapticEnabled(savedHaptic === 'true');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');
  }, []);

  const handleHapticChange = (checked: boolean) => {
    setHapticEnabled(checked);
    localStorage.setItem('sereneflow-haptic', checked.toString());
    
    if (checked && 'vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  const handleSoundChange = (checked: boolean) => {
    setSoundEnabled(checked);
    localStorage.setItem('sereneflow-sound', checked.toString());
    
    if (checked) {
      // Test sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  return (
    <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center text-slate-800 dark:text-slate-100">
          Feedback Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4 text-serene-teal" />
            <Label htmlFor="haptic" className="text-slate-700 dark:text-slate-200">
              Haptic Feedback
            </Label>
          </div>
          <Switch
            id="haptic"
            checked={hapticEnabled}
            onCheckedChange={handleHapticChange}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-serene-teal" />
            <Label htmlFor="sound" className="text-slate-700 dark:text-slate-200">
              Sound Feedback
            </Label>
          </div>
          <Switch
            id="sound"
            checked={soundEnabled}
            onCheckedChange={handleSoundChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackSettings;
