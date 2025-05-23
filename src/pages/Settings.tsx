
import { useState, useEffect } from "react";
import { Moon, Sun, Smartphone, Bell, BookOpen, Info, Trash2, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(false);
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem('sereneflow-theme');
    const savedHaptic = localStorage.getItem('sereneflow-haptic');
    const savedSound = localStorage.getItem('sereneflow-sound');
    const savedNotifications = localStorage.getItem('sereneflow-notifications');

    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (savedHaptic === 'false') setHapticFeedback(false);
    if (savedSound === 'true') setSoundFeedback(true);
    if (savedNotifications === 'true') setNotifications(true);
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked);
    localStorage.setItem('sereneflow-theme', checked ? 'dark' : 'light');
    
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleHapticChange = (checked: boolean) => {
    setHapticFeedback(checked);
    localStorage.setItem('sereneflow-haptic', checked.toString());
    
    if (checked && 'vibrate' in navigator) {
      try {
        navigator.vibrate(100);
      } catch (error) {
        console.log('Vibration not available');
      }
    }
  };

  const handleSoundChange = (checked: boolean) => {
    setSoundFeedback(checked);
    localStorage.setItem('sereneflow-sound', checked.toString());
    
    if (checked) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (error) {
        console.log('Audio context not available');
      }
    }
  };

  const handleNotificationChange = async (checked: boolean) => {
    if (checked) {
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            setNotifications(true);
            localStorage.setItem('sereneflow-notifications', 'true');
            toast.success('Notifications enabled');
            
            // Test notification
            new Notification('SereneFlow', {
              body: 'Notifications are now enabled for your breathing reminders!',
              icon: '/favicon.ico'
            });
          } else {
            toast.error('Notification permission denied');
          }
        } catch (error) {
          toast.error('Notification setup failed');
        }
      } else {
        toast.error('Notifications not supported on this device');
      }
    } else {
      setNotifications(false);
      localStorage.setItem('sereneflow-notifications', 'false');
    }
  };

  const clearAllData = () => {
    const confirm = window.confirm('Are you sure you want to clear all your data? This action cannot be undone.');
    
    if (confirm) {
      localStorage.removeItem('sereneflow-sessions');
      localStorage.removeItem('sereneflow-streak');
      localStorage.removeItem('sereneflow-total-sessions');
      localStorage.removeItem('sereneflow-custom-patterns');
      toast.success('All data cleared');
    }
  };

  const exportData = () => {
    const sessions = localStorage.getItem('sereneflow-sessions') || '[]';
    const streak = localStorage.getItem('sereneflow-streak') || '0';
    const totalSessions = localStorage.getItem('sereneflow-total-sessions') || '0';
    const customPatterns = localStorage.getItem('sereneflow-custom-patterns') || '[]';
    
    const data = {
      sessions: JSON.parse(sessions),
      streak: parseInt(streak),
      totalSessions: parseInt(totalSessions),
      customPatterns: JSON.parse(customPatterns),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sereneflow-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Customize your experience
          </p>
        </div>

        {/* Appearance */}
        <Card className="mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
              {darkMode ? <Moon className="h-5 w-5 mr-2" /> : <Sun className="h-5 w-5 mr-2" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-slate-700 dark:text-slate-200 font-medium">
                Dark Mode
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={handleThemeChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
              <Smartphone className="h-5 w-5 mr-2" />
              Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="haptic" className="text-slate-700 dark:text-slate-200 font-medium">
                  Haptic Feedback
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Vibrations during breathing exercises
                </p>
              </div>
              <Switch
                id="haptic"
                checked={hapticFeedback}
                onCheckedChange={handleHapticChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sound" className="text-slate-700 dark:text-slate-200 font-medium flex items-center">
                  <Volume2 className="h-4 w-4 mr-1" />
                  Sound Feedback
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Audio cues for breathing phases
                </p>
              </div>
              <Switch
                id="sound"
                checked={soundFeedback}
                onCheckedChange={handleSoundChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-slate-700 dark:text-slate-200 font-medium flex items-center">
                  <Bell className="h-4 w-4 mr-1" />
                  Notifications
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Daily practice reminders
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={handleNotificationChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Learning */}
        <Card className="mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
              <BookOpen className="h-5 w-5 mr-2" />
              Learning
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
              onClick={() => window.open('/learn', '_blank')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Breathing Techniques Guide
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="mb-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-slate-900 dark:text-white">
              <Info className="h-5 w-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-2 border-serene-teal text-serene-teal hover:bg-serene-teal hover:text-white font-semibold"
              onClick={exportData}
            >
              Export My Data
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start border-2 border-red-300 text-red-600 hover:bg-red-500 hover:text-white font-semibold"
              onClick={clearAllData}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                SereneFlow
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 font-medium">
                Version 1.0.0
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your calm breathing companion for stress relief, focus, and mindfulness. 
                Practice mindful breathing techniques anytime, anywhere.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Safety Note */}
        <Alert className="mt-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium">
            Always practice breathing exercises in a safe environment. Stop if you feel dizzy or uncomfortable.
          </AlertDescription>
        </Alert>
      </div>

      <Navigation />
    </div>
  );
};

export default Settings;
