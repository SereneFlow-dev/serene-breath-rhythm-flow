
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SoundSettings from "@/components/SoundSettings";
import HapticSettings from "@/components/HapticSettings";

const SoundHapticSettings = () => {
  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center text-slate-900 dark:text-slate-100">
          Feedback Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SoundSettings />
        <HapticSettings />
      </CardContent>
    </Card>
  );
};

export default SoundHapticSettings;
