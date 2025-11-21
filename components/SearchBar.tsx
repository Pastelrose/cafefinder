"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    allTags: string[];
    onSearch: (query: string) => void;
    onFilterChange: (tags: string[], operator: "AND" | "OR") => void;
    className?: string;
}

export default function SearchBar({
    allTags,
    onSearch,
    onFilterChange,
    className,
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [operator, setOperator] = useState<"AND" | "OR">("OR");

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const toggleTag = (tag: string) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag];

        setSelectedTags(newTags);
        onFilterChange(newTags, operator);
    };

    const handleOperatorChange = (newOperator: "AND" | "OR") => {
        setOperator(newOperator);
        onFilterChange(selectedTags, newOperator);
    };

    const clearFilters = () => {
        setSelectedTags([]);
        onFilterChange([], operator);
    };

    return (
        <div className={cn("flex flex-col gap-2 bg-white p-4 shadow-sm", className)}>
            {/* Top Row: Input + Buttons */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="카페 이름, 지역 검색..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    {query && (
                        <button
                            onClick={() => {
                                setQuery("");
                                onSearch("");
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
                <button
                    onClick={handleSearch}
                    className="flex items-center justify-center rounded-full bg-blue-600 p-2.5 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                >
                    <Search className="h-5 w-5" />
                </button>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={cn(
                        "flex items-center justify-center rounded-full border p-2.5 transition-all active:scale-95",
                        isFilterOpen || selectedTags.length > 0
                            ? "border-blue-200 bg-blue-50 text-blue-600 shadow-inner"
                            : "border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:shadow-md"
                    )}
                >
                    <SlidersHorizontal className="h-5 w-5" />
                </button>
            </div>

            {/* Filter Section */}
            {isFilterOpen && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="text-sm font-medium text-gray-700">필터 옵션</span>
                        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                            <button
                                onClick={() => handleOperatorChange("OR")}
                                className={cn(
                                    "rounded-md px-3 py-1 text-xs font-medium transition-all",
                                    operator === "OR"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                하나라도 (OR)
                            </button>
                            <button
                                onClick={() => handleOperatorChange("AND")}
                                className={cn(
                                    "rounded-md px-3 py-1 text-xs font-medium transition-all",
                                    operator === "AND"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                모두 포함 (AND)
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                    "rounded-full px-3 py-1 text-sm font-medium transition-colors border",
                                    selectedTags.includes(tag)
                                        ? "border-blue-200 bg-blue-50 text-blue-600"
                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>

                    {selectedTags.length > 0 && (
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={clearFilters}
                                className="text-xs text-gray-500 hover:text-red-500 underline"
                            >
                                필터 초기화
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
