import { useState, useEffect } from "react";
import { Smartphone, TestTube } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { triggerHapticPattern } from "@/utils/audioUtils";
import type { HapticPattern } from "@/utils/audioUtils";
import { toast } from "sonner";
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
  const handleHapticPatternChange = (value: HapticPattern) => {
    setHapticPattern(value);
    localStorage.setItem('sereneflow-haptic-pattern', value);
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
  const hapticOptions = [{
    value: 'gentle',
    label: 'Gentle'
  }, {
    value: 'medium',
    label: 'Medium'
  }, {
    value: 'strong',
    label: 'Strong'
  }, {
    value: 'subtle',
    label: 'Subtle'
  }, {
    value: 'rhythmic',
    label: 'Rhythmic'
  }];
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <Label htmlFor="haptic" className="text-slate-900 dark:text-slate-100 font-medium">
            Haptic Feedback
          </Label>
        </div>
        <Switch id="haptic" checked={hapticEnabled} onCheckedChange={handleHapticToggle} />
      </div>
      
      {hapticEnabled && <div className="space-y-3 ml-6">
          <div>
            <Label className="text-sm text-slate-800 dark:text-slate-200 font-medium">Haptic Pattern</Label>
            <Select value={hapticPattern} onValueChange={handleHapticPatternChange}>
              <SelectTrigger className="mt-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                {hapticOptions.map(option => <SelectItem key={option.value} value={option.value} className="text-black dark:text-slate-100">
                    {option.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={testHaptic} variant="outline" size="sm" className="w-full border-2 border-indigo-300 dark:border-indigo-600 text-indigo-500 bg-slate-50 font-medium text-sm">
            <TestTube className="h-4 w-4 mr-2" />
            Test Haptic
          </Button>
        </div>}
    </div>;
};
export default HapticSettings;