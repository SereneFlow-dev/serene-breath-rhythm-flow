
import { Filter, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface LibraryFiltersProps {
  selectedCategory: string | null;
  selectedDifficulty: string | null;
  searchTerm: string;
  isFiltersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
  onCategoryChange: (category: string | null) => void;
  onDifficultyChange: (difficulty: string | null) => void;
  onClearFilters: () => void;
}

const LibraryFilters = ({
  selectedCategory,
  selectedDifficulty,
  searchTerm,
  isFiltersOpen,
  onFiltersOpenChange,
  onCategoryChange,
  onDifficultyChange,
  onClearFilters
}: LibraryFiltersProps) => {
  const categories = ["Relaxation", "Focus", "Energy", "Sleep", "Health", "Pranayama", "Meditation", "Therapeutic"];
  const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];
  const hasActiveFilters = selectedCategory || selectedDifficulty || searchTerm;

  return (
    <Collapsible open={isFiltersOpen} onOpenChange={onFiltersOpenChange} className="mb-6">
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Filters</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {[selectedCategory, selectedDifficulty].filter(Boolean).length}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearFilters();
                  }}
                  className="text-xs text-serene-teal"
                >
                  Clear all
                </Button>
              )}
              <ChevronDown className={`h-4 w-4 text-slate-600 dark:text-slate-400 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-3">
            {/* Category Filter */}
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer text-xs ${
                      selectedCategory === category
                        ? "bg-serene-teal text-white"
                        : "border-serene-teal text-serene-teal hover:bg-serene-teal hover:text-white"
                    }`}
                    onClick={() => onCategoryChange(selectedCategory === category ? null : category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Difficulty</p>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    className={`cursor-pointer text-xs ${
                      selectedDifficulty === difficulty
                        ? "bg-serene-teal text-white"
                        : "border-serene-teal text-serene-teal hover:bg-serene-teal hover:text-white"
                    }`}
                    onClick={() => onDifficultyChange(selectedDifficulty === difficulty ? null : difficulty)}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
};

export default LibraryFilters;
