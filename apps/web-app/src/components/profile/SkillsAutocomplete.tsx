'use client';

import React, { useState, useRef, useEffect } from 'react';
import { searchSkills, POPULAR_SKILLS, getAllCategories, getSkillsByCategory } from '@/lib/skills-database';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PlusIcon,
  ChevronDownIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsExperience: number;
}

interface SkillsAutocompleteProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  isEditing: boolean;
  maxSkills?: number;
}

export default function SkillsAutocomplete({
  skills,
  onSkillsChange,
  isEditing,
  maxSkills = 20,
}: SkillsAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ skill: string; category: string }[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryBrowser, setShowCategoryBrowser] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle search input
  useEffect(() => {
    if (searchQuery.length >= 1) {
      const results = searchSkills(searchQuery, 10);
      // Filter out already added skills
      const filteredResults = results.filter(
        r => !skills.some(s => s.name.toLowerCase() === r.skill.toLowerCase())
      );
      setSearchResults(filteredResults);
      setIsDropdownOpen(filteredResults.length > 0);
    } else {
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  }, [searchQuery, skills]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setShowCategoryBrowser(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSkill = (skillName: string) => {
    if (skills.length >= maxSkills) return;
    if (skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) return;

    const newSkill: Skill = {
      name: skillName,
      level: 'Intermediate',
      yearsExperience: 1,
    };
    onSkillsChange([...skills, newSkill]);
    setSearchQuery('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const removeSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    onSkillsChange(newSkills);
  };

  const updateSkillLevel = (index: number, level: Skill['level']) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], level };
    onSkillsChange(newSkills);
  };

  const updateSkillYears = (index: number, years: number) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], yearsExperience: years };
    onSkillsChange(newSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      // If there's a search result, add the first one
      if (searchResults.length > 0) {
        addSkill(searchResults[0].skill);
      } else {
        // Allow adding custom skill
        addSkill(searchQuery.trim());
      }
    }
  };

  const categories = getAllCategories();

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Expert': return 'bg-gold text-gold-darkest';
      case 'Advanced': return 'bg-purple-100 text-navy';
      case 'Intermediate': return 'bg-success-light text-success-dark';
      default: return 'bg-bg-secondary text-text-secondary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Add Section */}
      {isEditing && skills.length < maxSkills && (
        <div className="relative" ref={dropdownRef}>
          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchQuery.length >= 1 && searchResults.length > 0) {
                  setIsDropdownOpen(true);
                }
              }}
              placeholder="Search skills (e.g., Python, Project Management, Leadership)"
              className="input-field min-h-12 pl-10 pr-24"
            />
            <button
              type="button"
              onClick={() => setShowCategoryBrowser(!showCategoryBrowser)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary hover:text-navy transition-colors rounded-md hover:bg-bg-secondary"
            >
              Browse
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${showCategoryBrowser ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {isDropdownOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.skill}-${index}`}
                  type="button"
                  onClick={() => addSkill(result.skill)}
                  className="w-full px-4 py-3 text-left hover:bg-bg-secondary flex items-center justify-between group transition-colors"
                >
                  <div>
                    <span className="font-medium text-text-primary">{result.skill}</span>
                    <span className="ml-2 text-xs text-text-tertiary">{result.category}</span>
                  </div>
                  <PlusIcon className="h-4 w-4 text-text-tertiary group-hover:text-navy transition-colors" />
                </button>
              ))}
              {searchQuery.trim() && !searchResults.some(r => r.skill.toLowerCase() === searchQuery.trim().toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => addSkill(searchQuery.trim())}
                  className="w-full px-4 py-3 text-left hover:bg-bg-secondary flex items-center justify-between border-t border-border group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-gold" />
                    <span className="text-text-primary">Add &quot;{searchQuery.trim()}&quot; as custom skill</span>
                  </div>
                  <PlusIcon className="h-4 w-4 text-text-tertiary group-hover:text-navy transition-colors" />
                </button>
              )}
            </div>
          )}

          {/* Category Browser */}
          {showCategoryBrowser && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-96 overflow-hidden">
              <div className="flex h-80">
                {/* Categories List */}
                <div className="w-1/3 border-r border-border overflow-y-auto">
                  <div className="p-2">
                    <p className="text-xs font-medium text-text-tertiary px-2 py-1">Categories</p>
                  </div>
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-purple-100 text-navy font-medium'
                          : 'hover:bg-bg-secondary text-text-primary'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Skills in Category */}
                <div className="w-2/3 overflow-y-auto">
                  {selectedCategory ? (
                    <div className="p-3">
                      <p className="text-sm font-medium text-text-primary mb-2">{selectedCategory}</p>
                      <div className="flex flex-wrap gap-2">
                        {getSkillsByCategory(selectedCategory).map((skill) => {
                          const isAdded = skills.some(s => s.name.toLowerCase() === skill.toLowerCase());
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => !isAdded && addSkill(skill)}
                              disabled={isAdded}
                              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                isAdded
                                  ? 'bg-success-light text-success-dark cursor-default'
                                  : 'bg-bg-secondary text-text-primary hover:bg-purple-100 hover:text-navy'
                              }`}
                            >
                              {isAdded ? '✓ ' : '+ '}{skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-text-tertiary">
                      <p className="text-sm">Select a category to browse skills</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Popular Skills Suggestions */}
          {!isDropdownOpen && !showCategoryBrowser && searchQuery.length === 0 && skills.length < 5 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-text-tertiary mb-2">Popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.filter(skill => !skills.some(s => s.name.toLowerCase() === skill.toLowerCase()))
                  .slice(0, 8)
                  .map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="px-3 py-1.5 bg-bg-secondary text-text-primary rounded-full text-sm hover:bg-purple-100 hover:text-navy transition-colors"
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skills Count */}
      {isEditing && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-tertiary">
            {skills.length} of {maxSkills} skills added
          </span>
          {skills.length >= maxSkills && (
            <span className="text-gold-dark">Maximum skills reached</span>
          )}
        </div>
      )}

      {/* Skills Display */}
      {skills.length === 0 ? (
        <div className="text-center py-8">
          <SparklesIcon className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
          <p className="text-text-tertiary">No skills added yet</p>
          {isEditing && (
            <p className="text-sm text-text-tertiary mt-1">
              Search above to add your professional skills
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div
              key={`${skill.name}-${index}`}
              className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium text-text-primary truncate">{skill.name}</h4>
                  {isEditing ? (
                    <select
                      value={skill.level}
                      onChange={(e) => updateSkillLevel(index, e.target.value as Skill['level'])}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${getLevelColor(skill.level)}`}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  ) : (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={skill.yearsExperience}
                        onChange={(e) => updateSkillYears(index, Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        max="50"
                        className="w-16 text-sm px-2 py-1 border border-border rounded text-center"
                      />
                      <span className="text-sm text-text-tertiary">years experience</span>
                    </div>
                  ) : (
                    <span className="text-sm text-text-tertiary">
                      {skill.yearsExperience} {skill.yearsExperience === 1 ? 'year' : 'years'} experience
                    </span>
                  )}
                </div>
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="ml-4 p-2 text-text-tertiary hover:text-error hover:bg-error-light rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${skill.name}`}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
