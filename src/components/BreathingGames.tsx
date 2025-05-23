
import { useState, useEffect } from "react";
import { Trophy, Star, Target, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import BreathingAnimation from "./BreathingAnimation";
import { toast } from "sonner";

interface BreathingGame {
  id: string;
  name: string;
  description: string;
  objective: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  targetScore: number;
  duration: number; // in seconds
}

const breathingGames: BreathingGame[] = [
  {
    id: 'rhythm-master',
    name: 'Rhythm Master',
    description: 'Match the breathing pattern perfectly for maximum points',
    objective: 'Maintain steady rhythm for 2 minutes',
    difficulty: 'Easy',
    targetScore: 100,
    duration: 120
  },
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    description: 'Keep your breathing as calm and steady as possible',
    objective: 'Minimize breathing variation',
    difficulty: 'Medium',
    targetScore: 150,
    duration: 180
  },
  {
    id: 'breath-racer',
    name: 'Breath Racer',
    description: 'Navigate through breathing challenges at increasing speeds',
    objective: 'Complete all breathing cycles without mistakes',
    difficulty: 'Hard',
    targetScore: 200,
    duration: 240
  }
];

const BreathingGames = () => {
  const [selectedGame, setSelectedGame] = useState<BreathingGame | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [streak, setStreak] = useState(0);
  const [highScores, setHighScores] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load high scores from localStorage
    const savedScores = localStorage.getItem('sereneflow-game-scores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleGameComplete();
            return 0;
          }
          return prev - 1;
        });
        
        // Simulate score increase based on accuracy
        setCurrentScore(prev => prev + Math.floor(accuracy / 10));
        
        // Simulate accuracy variation (in real implementation, this would be based on breath detection)
        setAccuracy(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 10)));
        
        // Update streak
        if (accuracy > 80) {
          setStreak(prev => prev + 1);
        } else {
          setStreak(0);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, accuracy]);

  const startGame = (game: BreathingGame) => {
    setSelectedGame(game);
    setIsPlaying(true);
    setCurrentScore(0);
    setTimeRemaining(game.duration);
    setAccuracy(100);
    setStreak(0);
    toast.success(`Starting ${game.name}!`);
  };

  const handleGameComplete = () => {
    if (!selectedGame) return;
    
    setIsPlaying(false);
    
    const isNewHighScore = currentScore > (highScores[selectedGame.id] || 0);
    
    if (isNewHighScore) {
      const newHighScores = { ...highScores, [selectedGame.id]: currentScore };
      setHighScores(newHighScores);
      localStorage.setItem('sereneflow-game-scores', JSON.stringify(newHighScores));
      toast.success(`New high score! ${currentScore} points`);
    } else {
      toast.success(`Game completed! Score: ${currentScore} points`);
    }
    
    // Award achievements
    if (currentScore >= selectedGame.targetScore) {
      toast.success(`Achievement unlocked: ${selectedGame.name} Master!`);
    }
  };

  const stopGame = () => {
    setIsPlaying(false);
    setSelectedGame(null);
    setCurrentScore(0);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  };

  if (selectedGame && isPlaying) {
    return (
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
              {selectedGame.name}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={stopGame}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400"
            >
              Stop Game
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Game Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {currentScore}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatTime(timeRemaining)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Time Left</p>
            </div>
          </div>

          {/* Accuracy Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Accuracy
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {Math.round(accuracy)}%
              </span>
            </div>
            <Progress value={accuracy} className="h-2" />
          </div>

          {/* Streak Counter */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {streak} streak
              </span>
            </div>
          </div>

          {/* Breathing Animation */}
          <div className="flex justify-center">
            <BreathingAnimation
              phase="inhale"
              duration={4000}
              isActive={true}
            />
          </div>

          {/* Objective */}
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
              Objective: {selectedGame.objective}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Breathing Games
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Make breathing exercises fun and engaging with gamified challenges
        </p>
      </div>

      <div className="grid gap-4">
        {breathingGames.map((game) => (
          <Card key={game.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {game.name}
                    </h3>
                    <Badge className={getDifficultyColor(game.difficulty)}>
                      {game.difficulty}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-2">
                    {game.description}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <strong>Objective:</strong> {game.objective}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{game.targetScore} pts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4" />
                    <span>Best: {highScores[game.id] || 0}</span>
                  </div>
                  <div>
                    <span>{formatTime(game.duration)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => startGame(game)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Play Game
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Section */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900 dark:text-slate-100 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {breathingGames.map((game) => {
              const hasAchievement = (highScores[game.id] || 0) >= game.targetScore;
              return (
                <div
                  key={game.id}
                  className={`p-3 rounded-lg border ${
                    hasAchievement 
                      ? 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-600' 
                      : 'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Star className={`h-4 w-4 ${hasAchievement ? 'text-yellow-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${
                      hasAchievement ? 'text-yellow-900 dark:text-yellow-100' : 'text-gray-600 dark:text-gray-300'
                    }`}>
                      {game.name} Master
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${
                    hasAchievement ? 'text-yellow-700 dark:text-yellow-200' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Score {game.targetScore}+ points
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingGames;
