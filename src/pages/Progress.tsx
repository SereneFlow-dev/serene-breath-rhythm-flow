
import { useState, useEffect } from "react";
import { Calendar, Clock, TrendingUp, Award, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

interface Session {
  id: number;
  technique: string;
  duration: number;
  cycles: number;
  date: string;
}

interface DayStats {
  date: string;
  sessions: number;
  totalDuration: number;
  techniques: string[];
}

interface WeekStats {
  weekStart: string;
  weekEnd: string;
  sessions: number;
  totalDuration: number;
  avgDailyDuration: number;
  daysActive: number;
}

const Progress = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

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

  const getDailyStats = (): DayStats[] => {
    const dailyMap = new Map<string, DayStats>();
    
    sessions.forEach(session => {
      const date = new Date(session.date).toDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date,
          sessions: 0,
          totalDuration: 0,
          techniques: []
        });
      }
      
      const dayStats = dailyMap.get(date)!;
      dayStats.sessions += 1;
      dayStats.totalDuration += session.duration;
      if (!dayStats.techniques.includes(session.technique)) {
        dayStats.techniques.push(session.technique);
      }
    });

    return Array.from(dailyMap.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const getWeeklyStats = (): WeekStats[] => {
    const weeklyMap = new Map<string, WeekStats>();
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const weekStart = new Date(sessionDate);
      weekStart.setDate(sessionDate.getDate() - sessionDate.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekKey = weekStart.toISOString();
      
      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, {
          weekStart: weekStart.toDateString(),
          weekEnd: weekEnd.toDateString(),
          sessions: 0,
          totalDuration: 0,
          avgDailyDuration: 0,
          daysActive: 0
        });
      }
      
      const weekStats = weeklyMap.get(weekKey)!;
      weekStats.sessions += 1;
      weekStats.totalDuration += session.duration;
    });

    // Calculate average daily duration and days active for each week
    weeklyMap.forEach(weekStats => {
      const weekSessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        const weekStart = new Date(weekStats.weekStart);
        const weekEnd = new Date(weekStats.weekEnd);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

      const uniqueDays = new Set(weekSessions.map(session => 
        new Date(session.date).toDateString()
      ));
      
      weekStats.daysActive = uniqueDays.size;
      weekStats.avgDailyDuration = weekStats.daysActive > 0 ? 
        Math.round(weekStats.totalDuration / weekStats.daysActive) : 0;
    });

    return Array.from(weeklyMap.values()).sort((a, b) => 
      new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
    );
  };

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
  const dailyStats = getDailyStats();
  const weeklyStats = getWeeklyStats();

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

        {/* Detailed Stats */}
        <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Detailed Statistics</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-3 mt-4">
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400 mb-2">No sessions yet</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      Complete your first breathing session to see your progress here
                    </p>
                  </div>
                ) : (
                  sessions.slice(0, 10).map((session) => (
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
                  ))
                )}
              </TabsContent>

              <TabsContent value="daily" className="space-y-3 mt-4">
                {dailyStats.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400">No daily data available</p>
                  </div>
                ) : (
                  dailyStats.slice(0, 14).map((day) => (
                    <div key={day.date} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {day.techniques.length} technique{day.techniques.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {day.sessions}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                          {formatDuration(day.totalDuration)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="weekly" className="space-y-3 mt-4">
                {weeklyStats.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400">No weekly data available</p>
                  </div>
                ) : (
                  weeklyStats.slice(0, 8).map((week, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          Week of {new Date(week.weekStart).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                          {week.sessions}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Total Time</p>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {formatDuration(week.totalDuration)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Daily Avg</p>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {formatDuration(week.avgDailyDuration)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Days Active</p>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {week.daysActive}/7
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Progress;
