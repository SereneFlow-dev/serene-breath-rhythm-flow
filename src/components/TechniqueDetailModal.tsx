
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Play, AlertTriangle, Clock, Target } from "lucide-react";
import { BreathingTechnique } from "@/data/breathingTechniques";

interface TechniqueDetailModalProps {
  technique: BreathingTechnique | null;
  isOpen: boolean;
  onClose: () => void;
}

const TechniqueDetailModal = ({ technique, isOpen, onClose }: TechniqueDetailModalProps) => {
  if (!technique) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-0 shadow-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {technique.name}
          </DialogTitle>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              {technique.difficulty}
            </Badge>
            {technique.category.slice(0, 2).map((cat) => (
              <Badge key={cat} variant="outline" className="text-xs border-serene-teal/50 text-serene-teal">
                {cat}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {technique.description}
            </p>
          </div>

          {/* Pattern & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <Target className="h-4 w-4 text-serene-teal mr-1" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Pattern</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {technique.defaultPattern.inhale}s - {technique.defaultPattern.holdAfterInhale}s - {technique.defaultPattern.exhale}s - {technique.defaultPattern.holdAfterExhale}s
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <Clock className="h-4 w-4 text-serene-teal mr-1" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Duration</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{technique.duration}</p>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Instructions
            </h4>
            <ol className="space-y-2">
              {technique.instructions.map((instruction, index) => (
                <li key={index} className="flex text-sm text-slate-600 dark:text-slate-400">
                  <span className="bg-serene-teal/20 text-serene-teal rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-medium mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Benefits
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {technique.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 bg-serene-teal rounded-full mr-3 flex-shrink-0"></span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {technique.warnings && technique.warnings.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                  Important Precautions
                </h4>
              </div>
              <ul className="space-y-1">
                {technique.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-orange-700 dark:text-orange-300 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Link to={`/session/${technique.id}`} className="w-full">
              <Button 
                className="w-full bg-serene-teal hover:bg-serene-teal/90 text-white"
                onClick={onClose}
              >
                <Play className="h-4 w-4 mr-2" />
                Start Practice
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechniqueDetailModal;
