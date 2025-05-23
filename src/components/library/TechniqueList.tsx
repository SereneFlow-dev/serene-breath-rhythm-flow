
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreathingTechnique } from "@/data/breathingTechniques";
import TechniqueCard from "./TechniqueCard";

interface TechniqueListProps {
  techniques: BreathingTechnique[];
  onTechniqueClick: (technique: BreathingTechnique) => void;
  onClearFilters: () => void;
}

const TechniqueList = ({ techniques, onTechniqueClick, onClearFilters }: TechniqueListProps) => {
  return (
    <div className="space-y-4">
      {/* Results Count */}
      <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {techniques.length} technique{techniques.length !== 1 ? 's' : ''} found
      </div>

      {/* Techniques */}
      {techniques.map((technique) => (
        <TechniqueCard
          key={technique.id}
          technique={technique}
          onDetailsClick={onTechniqueClick}
        />
      ))}

      {/* No Results */}
      {techniques.length === 0 && (
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No techniques found matching your criteria
            </p>
            <Button onClick={onClearFilters} variant="outline" className="border-serene-teal text-serene-teal">
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TechniqueList;
