"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, Star, Ghost, Activity, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    onSearch: (query: string) => void;
    onFilterChange: (filters: FilterState) => void;
    initialQuery?: string;
}

export interface FilterState {
    pointDifficulty: [number, number];
    pointFear: [number, number];
    pointActivity: [number, number];
    pointRecommendation: [number, number];
}

interface FilterSliderProps {
    label: string;
    icon: React.ElementType;
    filterKey: keyof FilterState;
    colorClass: string;
    filters: FilterState;
    handleRangeChange: (key: keyof FilterState, value: [number, number]) => void;
}

const FilterSlider = ({
    label,
    icon: Icon,
    filterKey,
    colorClass,
    filters,
    handleRangeChange
}: FilterSliderProps) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-2 font-medium", colorClass)}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <span className="text-sm font-bold text-gray-700">
                {filters[filterKey][0]} - {filters[filterKey][1]}
            </span>
        </div>
        <div className="px-2">
            <div className="relative h-2 w-full rounded-full bg-gray-200">
                {/* Track */}
                <div
                    className={cn("absolute h-full rounded-full opacity-50", colorClass.replace("text-", "bg-"))}
                    style={{
                        left: `${filters[filterKey][0] * 10}%`,
                        right: `${100 - filters[filterKey][1] * 10}%`,
                    }}
                />

                {/* Min Thumb */}
                <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={filters[filterKey][0]}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val <= filters[filterKey][1]) {
                            handleRangeChange(filterKey, [val, filters[filterKey][1]]);
                        }
                    }}
                    className="pointer-events-none absolute inset-0 z-20 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-gray-200"
                />

                {/* Max Thumb */}
                <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={filters[filterKey][1]}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= filters[filterKey][0]) {
                            handleRangeChange(filterKey, [filters[filterKey][0], val]);
                        }
                    }}
                    className="pointer-events-none absolute inset-0 z-20 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-gray-200"
                />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-gray-400 px-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
            </div>
        </div>
    </div>
);

export default function SearchBar({ onSearch, onFilterChange, initialQuery = "" }: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        pointDifficulty: [0, 10],
        pointFear: [0, 10],
        pointActivity: [0, 10],
        pointRecommendation: [0, 10],
    });

    // Update query when initialQuery changes
    useEffect(() => {
        if (initialQuery) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query, onSearch]);

    // Apply filters
    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const handleRangeChange = (key: keyof FilterState, value: [number, number]) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    return (
        <div className="relative w-full max-w-md">
            {/* Search Input */}
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="지점, 호점, 테마명 검색..."
                    className="h-12 w-full rounded-full border border-gray-200 bg-white pl-12 pr-12 text-sm shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <div className="absolute left-4 flex h-5 w-5 items-center justify-center text-gray-400">
                    <Search className="h-5 w-5" />
                </div>

                {/* Filter Toggle Button */}
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                        "absolute right-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                        isFilterOpen ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    )}
                >
                    {isFilterOpen ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
                </button>
            </div>

            {/* Filter Panel */}
            {isFilterOpen && (
                <div className="absolute left-0 right-0 top-14 z-50 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl animate-in slide-in-from-top-2">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">상세 필터</h3>
                        <button
                            onClick={() => setFilters({
                                pointDifficulty: [0, 10],
                                pointFear: [0, 10],
                                pointActivity: [0, 10],
                                pointRecommendation: [0, 10],
                            })}
                            className="text-xs text-gray-500 underline hover:text-gray-800"
                        >
                            초기화
                        </button>
                    </div>

                    <div className="space-y-6">
                        <FilterSlider
                            label="난이도"
                            icon={Star}
                            filterKey="pointDifficulty"
                            colorClass="text-yellow-500"
                            filters={filters}
                            handleRangeChange={handleRangeChange}
                        />
                        <FilterSlider
                            label="공포도"
                            icon={Ghost}
                            filterKey="pointFear"
                            colorClass="text-purple-500"
                            filters={filters}
                            handleRangeChange={handleRangeChange}
                        />
                        <FilterSlider
                            label="활동성"
                            icon={Activity}
                            filterKey="pointActivity"
                            colorClass="text-blue-500"
                            filters={filters}
                            handleRangeChange={handleRangeChange}
                        />
                        <FilterSlider
                            label="추천도"
                            icon={ThumbsUp}
                            filterKey="pointRecommendation"
                            colorClass="text-green-500"
                            filters={filters}
                            handleRangeChange={handleRangeChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
