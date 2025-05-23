
import { Link } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BreathingTechnique } from "@/data/breathingTechniques";

interface TechniqueCardProps {
  technique: BreathingTechnique;
  onDetailsClick: (technique: BreathingTechnique) => void;
}

const TechniqueCard = ({ technique, onDetailsClick }: TechniqueCardProps) => {
  return (
    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {technique.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">
              {technique.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="secondary" className="text-xs">
                {technique.difficulty}
              </Badge>
              {technique.category.slice(0, 2).map((cat) => (
                <Badge key={cat} variant="outline" className="text-xs border-serene-teal/50 text-serene-teal">
                  {cat}
                </Badge>
              ))}
              {technique.warnings && (
                <Badge variant="outline" className="text-xs border-orange-400/50 text-orange-600">
                  ⚠️ Caution
                </Badge>
              )}
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Pattern: {technique.defaultPattern.inhale}s - {technique.defaultPattern.holdAfterInhale}s - {technique.defaultPattern.exhale}s - {technique.defaultPattern.holdAfterExhale}s
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="border-serene-teal text-serene-teal hover:bg-serene-teal hover:text-white text-xs"
                onClick={() => onDetailsClick(technique)}
              >
                <Info className="h-3 w-3 mr-1" />
                Details
              </Button>
              <Link to={`/session/${technique.id}`}>
                <Button size="sm" className="bg-serene-teal hover:bg-serene-teal/90 text-white text-xs">
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechniqueCard;
