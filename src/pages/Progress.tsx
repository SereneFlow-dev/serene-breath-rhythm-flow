
import { useState, useEffect } from "react";
import { Calendar, Clock, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

interface Session {
  id: number;
  technique: string;
  duration: number;
  cycles: number;
  date: string;
}

const Progress = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    // Load data from localStorage
    const savedSessions = JSON.parse(localStorage.getItem('sereneflow-sessions') || '[]');
    const savedStreak = parseInt(localStorage.getItem('sereneflow-streak') || '0');
    const savedTotalSessions = parseInt(localStorage.getItem('sereneflow-total-sessions') || '0');

    setSessions(savedSessions.reverse()); // Most recent first
    setStreak(savedStreak);
    setTotalSessions(savedTotalSessions);

    // Calculate total time
    const total = savedSessions.reduce((acc: number, session: Session) => acc + session.duration, 0);
    setTotalTime(total);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (streak >= 7) achievements.push({ title: "Week Warrior", description: "7-day streak" });
    if (streak >= 30) achievements.push({ title: "Month Master", description: "30-day streak" });
    if (totalSessions >= 10) achievements.push({ title: "Dedicated Breather", description: "10 sessions completed" });
    if (totalSessions >= 50) achievements.push({ title: "Breathing Expert", description: "50 sessions completed" });
    if (totalTime >= 3600) achievements.push({ title: "Hour of Zen", description: "1 hour of practice" });

    return achievements;
  };

  const achievements = getAchievements();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-slate-800 dark:text-slate-200 mb-2">
            Your Progress
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track your mindful journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-serene-teal mx-auto mb-2" />
              <p className="text-2xl font-semibold text-slate-800 dark:text-slate-200">{streak}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Day Streak</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 text-serene-teal mx-auto mb-2" />
              <p className="text-2xl font-semibold text-slate-800 dark:text-slate-200">{totalSessions}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Sessions</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-serene-teal mx-auto mb-2" />
            <p className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
              {formatDuration(totalTime)}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Practice Time</p>
          </CardContent>
        </Card>

        {/* Achievements */}
        {achievements.length > 0 && (
          <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-slate-800 dark:text-slate-200">
                <Award className="h-5 w-5 mr-2 text-serene-teal" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-serene-teal/20 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-serene-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{achievement.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Sessions */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-slate-400 mb-2">No sessions yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Complete your first breathing session to see your progress here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.slice(0, 10).map((session) => (
                  <div key={session.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{session.technique}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {session.cycles} cycles • {formatDuration(session.duration)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-500">
                        {formatDate(session.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Progress;
