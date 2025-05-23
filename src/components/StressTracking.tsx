
import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Heart, Brain, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

interface StressEntry {
  id: string;
  date: string;
  preSessionStress: number;
  postSessionStress: number;
  technique: string;
  duration: number;
  notes?: string;
  mood: 'anxious' | 'neutral' | 'calm' | 'energized';
  sleepQuality?: number;
}

const StressTracking = () => {
  const [stressEntries, setStressEntries] = useState<StressEntry[]>([]);
  const [preSessionStress, setPreSessionStress] = useState([5]);
  const [postSessionStress, setPostSessionStress] = useState([5]);
  const [currentMood, setCurrentMood] = useState<string>('neutral');
  const [sleepQuality, setSleepQuality] = useState([7]);
  const [notes, setNotes] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);

  useEffect(() => {
    const savedEntries = localStorage.getItem('sereneflow-stress-entries');
    if (savedEntries) {
      setStressEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveStressEntry = () => {
    const newEntry: StressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      preSessionStress: preSessionStress[0],
      postSessionStress: postSessionStress[0],
      technique: 'General Breathing', // This would come from the actual session
      duration: 300, // This would come from the actual session
      mood: currentMood as StressEntry['mood'],
      sleepQuality: sleepQuality[0],
      notes: notes.trim() || undefined
    };

    const updatedEntries = [...stressEntries, newEntry];
    setStressEntries(updatedEntries);
    localStorage.setItem('sereneflow-stress-entries', JSON.stringify(updatedEntries));
    
    setShowAssessment(false);
    setNotes('');
    toast.success('Stress assessment saved successfully!');
  };

  const getStressLevel = (level: number): { label: string; color: string } => {
    if (level <= 2) return { label: 'Very Low', color: 'text-green-600' };
    if (level <= 4) return { label: 'Low', color: 'text-green-500' };
    if (level <= 6) return { label: 'Moderate', color: 'text-yellow-500' };
    if (level <= 8) return { label: 'High', color: 'text-orange-500' };
    return { label: 'Very High', color: 'text-red-500' };
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'anxious': return '😰';
      case 'neutral': return '😐';
      case 'calm': return '😌';
      case 'energized': return '😊';
      default: return '😐';
    }
  };

  const calculateImprovement = () => {
    if (stressEntries.length === 0) return null;
    
    const recentEntries = stressEntries.slice(-7); // Last 7 entries
    const avgImprovement = recentEntries.reduce((acc, entry) => 
      acc + (entry.preSessionStress - entry.postSessionStress), 0
    ) / recentEntries.length;
    
    return avgImprovement;
  };

  const getChartData = () => {
    return stressEntries.slice(-14).map((entry, index) => ({
      session: index + 1,
      pre: entry.preSessionStress,
      post: entry.postSessionStress,
      date: new Date(entry.date).toLocaleDateString()
    }));
  };

  const improvement = calculateImprovement();
  const chartData = getChartData();

  if (showAssessment) {
    return (
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
            Stress Level Assessment
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Pre-Session Stress */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 block">
              How stressed do you feel right now? ({preSessionStress[0]}/10)
            </label>
            <div className="space-y-2">
              <Slider
                value={preSessionStress}
                onValueChange={setPreSessionStress}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Very Calm</span>
                <span>Extremely Stressed</span>
              </div>
            </div>
            <p className={`text-sm mt-2 font-medium ${getStressLevel(preSessionStress[0]).color}`}>
              {getStressLevel(preSessionStress[0]).label}
            </p>
          </div>

          {/* Current Mood */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 block">
              Current Mood
            </label>
            <Select value={currentMood} onValueChange={setCurrentMood}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anxious">😰 Anxious</SelectItem>
                <SelectItem value="neutral">😐 Neutral</SelectItem>
                <SelectItem value="calm">😌 Calm</SelectItem>
                <SelectItem value="energized">😊 Energized</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sleep Quality */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 block">
              Last Night's Sleep Quality ({sleepQuality[0]}/10)
            </label>
            <Slider
              value={sleepQuality}
              onValueChange={setSleepQuality}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2 block">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? Any specific stressors today?"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 resize-none"
              rows={3}
            />
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={saveStressEntry}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save Assessment
            </Button>
            <Button
              onClick={() => setShowAssessment(false)}
              variant="outline"
              className="border-slate-300 dark:border-slate-600"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Stress Tracking
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Monitor your stress levels and track improvement over time
          </p>
        </div>
        <Button
          onClick={() => setShowAssessment(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Heart className="h-4 w-4 mr-2" />
          Assess Stress
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total Sessions
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
              {stressEntries.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              {improvement && improvement > 0 ? (
                <TrendingDown className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingUp className="h-5 w-5 text-orange-600" />
              )}
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Avg Improvement
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
              {improvement ? `${improvement.toFixed(1)} pts` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                This Week
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
              {stressEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return entryDate > weekAgo;
              }).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stress Level Chart */}
      {chartData.length > 0 && (
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
              Stress Level Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="session" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip 
                    labelFormatter={(value) => `Session ${value}`}
                    formatter={(value, name) => [
                      value,
                      name === 'pre' ? 'Pre-Session' : 'Post-Session'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pre" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Pre-Session"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="post" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    name="Post-Session"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      {stressEntries.length > 0 && (
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
              Recent Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stressEntries.slice(-5).reverse().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Before</p>
                        <p className={`text-lg font-bold ${getStressLevel(entry.preSessionStress).color}`}>
                          {entry.preSessionStress}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-300">After</p>
                        <p className={`text-lg font-bold ${getStressLevel(entry.postSessionStress).color}`}>
                          {entry.postSessionStress}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Mood</p>
                        <p className="text-lg">
                          {getMoodEmoji(entry.mood)}
                        </p>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {entry.preSessionStress - entry.postSessionStress > 0 ? 'Improved' : 'Maintained'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stressEntries.length === 0 && (
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              Start Tracking Your Stress
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Begin monitoring your stress levels to see how breathing exercises help you feel better over time.
            </p>
            <Button
              onClick={() => setShowAssessment(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Take First Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StressTracking;
