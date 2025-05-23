
import { useState } from "react";
import { Plus, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1 flex items-center">
                  <Settings2 className="h-5 w-5 mr-2 text-serene-teal" />
                  Custom Pattern
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Create your own breathing rhythm
                </p>
              </div>
              <Plus className="h-6 w-6 text-serene-teal ml-4" />
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-slate-100">Custom Breathing Pattern</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-slate-700 dark:text-slate-200">Pattern Name</Label>
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="My Custom Pattern"
              className="mt-2 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
            />
          </div>
          <div>
            <Label className="text-slate-700 dark:text-slate-200">Inhale: {inhaleTime}s</Label>
            <Slider
              value={[inhaleTime]}
              onValueChange={(value) => setInhaleTime(value[0])}
              min={1}
              max={12}
              step={0.5}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-slate-700 dark:text-slate-200">Hold (after inhale): {holdInhaleTime}s</Label>
            <Slider
              value={[holdInhaleTime]}
              onValueChange={(value) => setHoldInhaleTime(value[0])}
              min={0}
              max={15}
              step={0.5}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-slate-700 dark:text-slate-200">Exhale: {exhaleTime}s</Label>
            <Slider
              value={[exhaleTime]}
              onValueChange={(value) => setExhaleTime(value[0])}
              min={1}
              max={12}
              step={0.5}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-slate-700 dark:text-slate-200">Hold (after exhale): {holdExhaleTime}s</Label>
            <Slider
              value={[holdExhaleTime]}
              onValueChange={(value) => setHoldExhaleTime(value[0])}
              min={0}
              max={15}
              step={0.5}
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-slate-700 dark:text-slate-200">Total Cycles: {totalCycles}</Label>
            <Slider
              value={[totalCycles]}
              onValueChange={(value) => setTotalCycles(value[0])}
              min={1}
              max={20}
              step={1}
              className="mt-2"
            />
          </div>
          <Button onClick={handleStartSession} className="w-full bg-serene-teal hover:bg-serene-teal/90 text-white">
            Start Custom Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomBreathingConfig;
