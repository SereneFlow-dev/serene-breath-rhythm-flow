
import { useState, useEffect } from "react";
import { Smartphone, TestTube } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { triggerHapticPattern, hapticPatterns } from "@/utils/audioUtils";
import type { HapticPattern } from "@/utils/audioUtils";

const HapticSettings = () => {
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [hapticPattern, setHapticPattern] = useState<HapticPattern>('gentle');

  useEffect(() => {
    const savedHaptic = localStorage.getItem('sereneflow-haptic');
    const savedHapticPattern = localStorage.getItem('sereneflow-haptic-pattern') as HapticPattern;
    if (savedHaptic !== null) setHapticEnabled(savedHaptic !== 'false');
    if (savedHapticPattern) setHapticPattern(savedHapticPattern);
  }, []);

  const handleHapticToggle = (checked: boolean) => {
    setHapticEnabled(checked);
    localStorage.setItem('sereneflow-haptic', checked.toString());
    
    if (checked) {
      // Test haptic feedback when enabled
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(100);
        } catch (error) {
          console.log('Vibration not supported:', error);
        }
      }
    }
  };

  const handleHapticPatternChange = (value: HapticPattern) => {
    setHapticPattern(value);
    localStorage.setItem('sereneflow-haptic-pattern', value);
    
    // Test the new pattern immediately
    if (hapticEnabled) {
      setTimeout(() => {
        triggerHapticPattern(value);
      }, 100);
    }
  };

  const testHaptic = () => {
    if (!hapticEnabled) {
      return;
    }

    try {
      triggerHapticPattern(hapticPattern);
    } catch (error) {
      console.log('Haptic test failed:', error);
    }
  };

  // Use the actual haptic patterns from audioUtils
  const hapticOptions = Object.entries(hapticPatterns)
    .filter(([key]) => key !== 'off')
    .map(([key, config]) => ({
      value: key as HapticPattern,
      label: config.name
    }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <Label htmlFor="haptic" className="text-slate-900 dark:text-slate-100 font-medium">
            Haptic Feedback
          </Label>
        </div>
        <Switch id="haptic" checked={hapticEnabled} onCheckedChange={handleHapticToggle} />
      </div>
      
      {hapticEnabled && (
        <div className="space-y-3 ml-6">
          <div>
            <Label className="text-sm text-slate-800 dark:text-slate-200 font-medium">Haptic Pattern</Label>
            <Select value={hapticPattern} onValueChange={handleHapticPatternChange}>
              <SelectTrigger className="mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                {hapticOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-black dark:text-slate-100">
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
            className="w-full border-2 border-indigo-300 dark:border-indigo-600 font-medium text-sm bg-slate-500 hover:bg-slate-400 text-slate-950"
          >
            <TestTube className="h-4 w-4 mr-2" />
            Test Haptic
          </Button>
        </div>
      )}
    </div>
  );
};

export default HapticSettings;
