import { useState, useEffect } from "react";
import { Plus, Settings2, Minus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CustomBreathingConfigProps {
  onStartCustomSession: (config: any) => void;
}

const CustomBreathingConfig = ({ onStartCustomSession }: CustomBreathingConfigProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [inhaleTime, setInhaleTime] = useState(4);
  const [holdInhaleTime, setHoldInhaleTime] = useState(4);
  const [exhaleTime, setExhaleTime] = useState(4);
  const [holdExhaleTime, setHoldExhaleTime] = useState(4);
  const [totalCycles, setTotalCycles] = useState(5);
  const [savedPatterns, setSavedPatterns] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sereneflow-custom-patterns');
    if (saved) {
      setSavedPatterns(JSON.parse(saved));
    }
  }, []);

  const adjustValue = (currentValue: number, adjustment: number, min: number, max: number) => {
    const newValue = currentValue + adjustment;
    return Math.max(min, Math.min(max, newValue));
  };

  const handleStartSession = () => {
    if (!customName.trim()) {
      toast.error("Please enter a name for your custom pattern");
      return;
    }

    const config = {
      name: customName,
      inhale: inhaleTime,
      holdInhale: holdInhaleTime,
      exhale: exhaleTime,
      holdExhale: holdExhaleTime,
      cycles: totalCycles
    };

    onStartCustomSession(config);
    setIsOpen(false);
  };

  const savePattern = () => {
    if (!customName.trim()) {
      toast.error("Please enter a name for your pattern");
      return;
    }

    const pattern = {
      id: Date.now().toString(),
      name: customName,
      inhale: inhaleTime,
      holdInhale: holdInhaleTime,
      exhale: exhaleTime,
      holdExhale: holdExhaleTime,
      cycles: totalCycles,
      createdAt: new Date().toISOString()
    };

    const newPatterns = [...savedPatterns, pattern];
    setSavedPatterns(newPatterns);
    localStorage.setItem('sereneflow-custom-patterns', JSON.stringify(newPatterns));
    toast.success("Pattern saved to library!");
  };

  const loadPattern = (pattern: any) => {
    setCustomName(pattern.name);
    setInhaleTime(pattern.inhale);
    setHoldInhaleTime(pattern.holdInhale);
    setExhaleTime(pattern.exhale);
    setHoldExhaleTime(pattern.holdExhale);
    setTotalCycles(pattern.cycles);
    toast.success("Pattern loaded!");
  };

  const deletePattern = (patternId: string) => {
    const newPatterns = savedPatterns.filter(p => p.id !== patternId);
    setSavedPatterns(newPatterns);
    localStorage.setItem('sereneflow-custom-patterns', JSON.stringify(newPatterns));
    toast.success("Pattern deleted");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center">
                  <Settings2 className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Custom Pattern
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Create your own breathing rhythm
                </p>
              </div>
              <Plus className="h-6 w-6 text-indigo-600 dark:text-indigo-400 ml-4" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Custom Breathing Pattern</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Saved Patterns */}
          {savedPatterns.length > 0 && (
            <div>
              <Label className="text-slate-800 dark:text-slate-200 font-medium mb-2 block">Saved Patterns</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {savedPatterns.map((pattern) => (
                  <div key={pattern.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded">
                    <span className="text-sm text-slate-700 dark:text-slate-300">{pattern.name}</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => loadPattern(pattern)}>
                        Load
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deletePattern(pattern.id)} className="text-red-600">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pattern Name */}
          <div>
            <Label className="text-slate-800 dark:text-slate-200 font-medium">Pattern Name</Label>
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="My Custom Pattern"
              className="mt-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
            />
          </div>

          {/* Inhale Time */}
          <div>
            <Label className="text-slate-800 dark:text-slate-200 font-medium mb-2 block">
              Inhale: {inhaleTime}s
            </Label>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInhaleTime(adjustValue(inhaleTime, -0.5, 1, 12))}
                className="h-8 w-8 p-0 border border-indigo-300 dark:border-indigo-600"
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
                className="h-8 w-8 p-0 border border-indigo-300 dark:border-indigo-600"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Hold After Inhale */}
          <div>
            <Label className="text-slate-800 dark:text-slate-200 font-medium mb-2 block">
              Hold (after inhale): {holdInhaleTime}s
            </Label>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setHoldInhaleTime(adjustValue(holdInhaleTime, -0.5, 0, 15))}
                className="h-8 w-8 p-0 border border-indigo-300 dark:border-indigo-600"
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
                className="h-8 w-8 p-0 border border-indigo-300 dark:border-indigo-600"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Exhale Time */}
          <div>
            <Label className="text-slate-800 dark:text-slate-200 font-medium mb-2 block">
              Exhale: {exhaleTime}s
            </Label>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setExhaleTime(adjustValue(exhaleTime, -0.5, 1, 12))}
                className="h-8 w-8 p-0 border border-indigo-300 dark:border-indigo-600"
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
                className="h-8 w-8 p-0 border border-indigo-300 dark:border-indigo-600"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Hold After Exhale */}
          <div>
            <Label className="text-slate-800 dark:text-slate-200 font-medium mb-2 block">
              Hold (after exhale): {holdExhaleTime}s
            </Label>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setHoldExhaleTime(adjustValue(holdExhaleTime, -0.5, 0, 15))}
                className="h-8 w-8 p-0 border border-indigo-300 dark:border-indigo-600"
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
                className="h-8 w-8 p-0 border border-indigo-300 dark:border-indigo-600"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Total Cycles */}
          <div>
            <Label className="text-slate-800 dark:text-slate-200 font-medium mb-2 block">
              Total Cycles: {totalCycles}
            </Label>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTotalCycles(adjustValue(totalCycles, -1, 1, 20))}
                className="h-8 w-8 p-0 border border-indigo-300 dark:border-indigo-600"
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
                className="h-8 w-8 p-0 border border-indigo-300 dark:border-indigo-600"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={savePattern} 
              variant="outline"
              className="flex-1 border border-indigo-300 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-900/30 font-semibold"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              onClick={handleStartSession} 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              Start Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomBreathingConfig;
