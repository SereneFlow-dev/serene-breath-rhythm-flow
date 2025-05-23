
import { useState, useEffect } from "react";
import { Smartphone, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
      try {
        // Test vibration
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

  const handleSoundChange = (checked: boolean) => {
    setSoundEnabled(checked);
    localStorage.setItem('sereneflow-sound', checked.toString());
    
    if (checked) {
      try {
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
        toast.success("Sound feedback enabled");
      } catch (error) {
        console.log('Audio not supported');
        toast.error("Audio not supported on this device");
      }
    } else {
      toast.info("Sound feedback disabled");
    }
  };

  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-2 border-slate-200/80 dark:border-slate-700/80 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
          Feedback Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4 text-serene-teal" />
            <Label htmlFor="haptic" className="text-slate-800 dark:text-slate-100 font-medium">
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
            <Label htmlFor="sound" className="text-slate-800 dark:text-slate-100 font-medium">
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
