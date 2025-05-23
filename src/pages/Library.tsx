
import { useState } from "react";
import Navigation from "@/components/Navigation";
import TechniqueDetailModal from "@/components/TechniqueDetailModal";
import LibrarySearch from "@/components/library/LibrarySearch";
import LibraryFilters from "@/components/library/LibraryFilters";
import TechniqueList from "@/components/library/TechniqueList";
import { breathingTechniques, BreathingTechnique } from "@/data/breathingTechniques";

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
        <LibrarySearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        {/* Filters */}
        <LibraryFilters
          selectedCategory={selectedCategory}
          selectedDifficulty={selectedDifficulty}
          searchTerm={searchTerm}
          isFiltersOpen={isFiltersOpen}
          onFiltersOpenChange={setIsFiltersOpen}
          onCategoryChange={setSelectedCategory}
          onDifficultyChange={setSelectedDifficulty}
          onClearFilters={clearFilters}
        />

        {/* Technique List */}
        <TechniqueList
          techniques={filteredTechniques}
          onTechniqueClick={handleTechniqueClick}
          onClearFilters={clearFilters}
        />
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
