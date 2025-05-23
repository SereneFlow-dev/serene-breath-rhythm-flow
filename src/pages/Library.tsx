
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Play, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import TechniqueDetailModal from "@/components/TechniqueDetailModal";
import { breathingTechniques, BreathingTechnique } from "@/data/breathingTechniques";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ["Relaxation", "Focus", "Energy", "Sleep", "Health", "Pranayama", "Meditation", "Therapeutic"];
  const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const filteredTechniques = breathingTechniques.filter((technique) => {
    const matchesSearch = technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technique.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || technique.category.includes(selectedCategory);
    const matchesDifficulty = !selectedDifficulty || technique.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSearchTerm("");
  };

  const handleTechniqueClick = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
    setIsModalOpen(true);
  };

  const hasActiveFilters = selectedCategory || selectedDifficulty || searchTerm;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-slate-800 dark:text-slate-200 mb-2">
            Breathing Library
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Discover techniques for every moment
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search techniques..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg"
          />
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Filter className="h-4 w-4 mr-2 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Filters</span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="ml-auto text-xs text-serene-teal"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            {/* Category Filter */}
            <div className="mb-3">
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
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
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
                    onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {filteredTechniques.length} technique{filteredTechniques.length !== 1 ? 's' : ''} found
        </div>

        {/* Techniques List */}
        <div className="space-y-4">
          {filteredTechniques.map((technique) => (
            <Card key={technique.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
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
                        onClick={() => handleTechniqueClick(technique)}
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
          ))}

          {filteredTechniques.length === 0 && (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  No techniques found matching your criteria
                </p>
                <Button onClick={clearFilters} variant="outline" className="border-serene-teal text-serene-teal">
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <TechniqueDetailModal 
        technique={selectedTechnique}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Navigation />
    </div>
  );
};

export default Library;
