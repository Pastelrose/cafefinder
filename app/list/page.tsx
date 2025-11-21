"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar, { FilterState } from "@/components/SearchBar";
import ThemeCard from "@/components/ThemeCard";
import ThemeDetailModal from "@/components/ThemeDetailModal";
import AdBanner from "@/components/AdBanner";
import { useEscapeStore } from "@/lib/store";
import { EscapeThemeDisplay } from "@/types";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

type SortOption = "recommendation" | "difficulty" | "activity" | "fear";

export default function ListPage() {
    const { getAllThemes } = useEscapeStore();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("search") || "";

    const [themes, setThemes] = useState<EscapeThemeDisplay[]>([]);
    const [filteredThemes, setFilteredThemes] = useState<EscapeThemeDisplay[]>([]);
    const [mounted, setMounted] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<EscapeThemeDisplay | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("recommendation");
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const allThemes = getAllThemes();
        setThemes(allThemes);

        // Initial filter if search param exists
        if (initialQuery) {
            const lowerQuery = initialQuery.toLowerCase();
            const filtered = allThemes.filter((theme) => {
                return (
                    theme.brandName.toLowerCase().includes(lowerQuery) ||
                    theme.branchName.toLowerCase().includes(lowerQuery) ||
                    theme.name.toLowerCase().includes(lowerQuery)
                );
            });
            setFilteredThemes(filtered);
        } else {
            setFilteredThemes(allThemes);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAllThemes, initialQuery]);

    const handleSearch = useCallback((query: string) => {
        if (!query) {
            setFilteredThemes(themes);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = themes.filter((theme) => {
            return (
                theme.brandName.toLowerCase().includes(lowerQuery) ||
                theme.branchName.toLowerCase().includes(lowerQuery) ||
                theme.name.toLowerCase().includes(lowerQuery)
            );
        });
        setFilteredThemes(filtered);
    }, [themes]);

    const handleFilterChange = useCallback((filters: FilterState) => {
        const filtered = themes.filter((theme) => {
            const matchDiff = theme.difficulty >= filters.difficulty[0] && theme.difficulty <= filters.difficulty[1];
            const matchFear = theme.fear >= filters.fear[0] && theme.fear <= filters.fear[1];
            const matchAct = theme.activity >= filters.activity[0] && theme.activity <= filters.activity[1];
            const matchRec = theme.recommendation >= filters.recommendation[0] && theme.recommendation <= filters.recommendation[1];

            return matchDiff && matchFear && matchAct && matchRec;
        });
        setFilteredThemes(filtered);
    }, [themes]);

    const sortThemes = useCallback((themesToSort: EscapeThemeDisplay[], sortOption: SortOption) => {
        return [...themesToSort].sort((a, b) => b[sortOption] - a[sortOption]);
    }, []);

    useEffect(() => {
        if (filteredThemes.length > 0) {
            const sorted = sortThemes(filteredThemes, sortBy);
            setFilteredThemes(sorted);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy]);

    const handleThemeClick = (theme: EscapeThemeDisplay) => {
        setSelectedTheme(theme);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTheme(null);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
                <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                        검색 결과 <span className="text-blue-600">{filteredThemes.length}</span>
                    </h2>

                    {/* Sort Button */}
                    <div className="relative">
                        <button
                            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                            정렬
                        </button>

                        {/* Sort Dropdown */}
                        {isSortDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-20">
                                <button
                                    onClick={() => {
                                        setSortBy("recommendation");
                                        setIsSortDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 first:rounded-t-lg ${sortBy === "recommendation" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                        }`}
                                >
                                    추천도 순
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy("difficulty");
                                        setIsSortDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${sortBy === "difficulty" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                        }`}
                                >
                                    난이도 순
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy("activity");
                                        setIsSortDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${sortBy === "activity" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                        }`}
                                >
                                    활동성 순
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy("fear");
                                        setIsSortDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 last:rounded-b-lg ${sortBy === "fear" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                        }`}
                                >
                                    공포도 순
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredThemes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    ) : (
                        filteredThemes.map((theme, index) => (
                            <div key={`${theme.branchId}-${theme.id}`}>
                                <ThemeCard theme={theme} onClick={() => handleThemeClick(theme)} />
                                {/* Show AdBanner every 5 items */}
                                {(index + 1) % 5 === 0 && index !== filteredThemes.length - 1 && (
                                    <div className="mt-4">
                                        <AdBanner />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Theme Detail Modal */}
            <ThemeDetailModal
                theme={selectedTheme}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
