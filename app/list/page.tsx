"use client";

import { useState, useEffect } from "react";
import SearchBar, { FilterState } from "@/components/SearchBar";
import ThemeCard from "@/components/ThemeCard";
import AdBanner from "@/components/AdBanner";
import { useEscapeStore } from "@/lib/store";
import { EscapeThemeDisplay } from "@/types";
import { useSearchParams } from "next/navigation";

export default function ListPage() {
    const { getAllThemes } = useEscapeStore();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("search") || "";

    const [themes, setThemes] = useState<EscapeThemeDisplay[]>([]);
    const [filteredThemes, setFilteredThemes] = useState<EscapeThemeDisplay[]>([]);
    const [mounted, setMounted] = useState(false);

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

    const handleSearch = (query: string) => {
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
    };

    const handleFilterChange = (filters: FilterState) => {
        const filtered = themes.filter((theme) => {
            const matchDiff = theme.difficulty >= filters.difficulty[0] && theme.difficulty <= filters.difficulty[1];
            const matchFear = theme.fear >= filters.fear[0] && theme.fear <= filters.fear[1];
            const matchAct = theme.activity >= filters.activity[0] && theme.activity <= filters.activity[1];
            const matchRec = theme.recommendation >= filters.recommendation[0] && theme.recommendation <= filters.recommendation[1];

            return matchDiff && matchFear && matchAct && matchRec;
        });
        setFilteredThemes(filtered);
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
                </div>

                <div className="space-y-4">
                    {filteredThemes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    ) : (
                        filteredThemes.map((theme, index) => (
                            <div key={`${theme.branchId}-${theme.id}`}>
                                <ThemeCard theme={theme} />
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
        </div>
    );
}
