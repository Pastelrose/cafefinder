"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar, { FilterState } from "@/components/SearchBar";
import ThemeCard from "@/components/ThemeCard";
import ThemeDetailModal from "@/components/ThemeDetailModal";
import AdBanner from "@/components/AdBanner";
import { useEscapeStore } from "@/lib/store";
import { EscapeThemeDisplay, Advertisement } from "@/types";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { advertisementApi } from "@/lib/api";

type SortOption = "pointRecommendation" | "pointDifficulty" | "pointActivity" | "pointFear";

export default function ListPage() {
    const { getAllThemes } = useEscapeStore();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("search") || "";

    const [themes, setThemes] = useState<EscapeThemeDisplay[]>([]);
    const [filteredThemes, setFilteredThemes] = useState<EscapeThemeDisplay[]>([]);
    const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
    const [mounted, setMounted] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState<EscapeThemeDisplay | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("pointRecommendation");
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const loadThemes = async () => {
            const allThemes = await getAllThemes();
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
        };

        const loadAdvertisements = async () => {
            try {
                const ads = await advertisementApi.getAll();
                // Transform backend data to frontend format
                const transformedAds: Advertisement[] = ads.map((ad: any) => ({
                    id: String(ad.id),
                    title: ad.title,
                    description: ad.description,
                    imageUrl: ad.imageUrl,
                    linkUrl: ad.linkUrl,
                    linkText: ad.linkText,
                    displayOrder: ad.displayOrder
                }));
                setAdvertisements(transformedAds);
            } catch (error) {
                console.error('Failed to load advertisements:', error);
            }
        };

        loadThemes();
        loadAdvertisements();
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
            const matchDiff = theme.pointDifficulty >= filters.pointDifficulty[0] && theme.pointDifficulty <= filters.pointDifficulty[1];
            const matchFear = theme.pointFear >= filters.pointFear[0] && theme.pointFear <= filters.pointFear[1];
            const matchAct = theme.pointActivity >= filters.pointActivity[0] && theme.pointActivity <= filters.pointActivity[1];
            const matchRec = theme.pointRecommendation >= filters.pointRecommendation[0] && theme.pointRecommendation <= filters.pointRecommendation[1];

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
                <SearchBar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    initialQuery={initialQuery}
                />
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
                                        setSortBy("pointRecommendation");
                                        setIsSortDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 first:rounded-t-lg ${sortBy === "pointRecommendation" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                        }`}
                                >
                                    추천도 순
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy("pointDifficulty");
                                        setIsSortDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${sortBy === "pointDifficulty" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                        }`}
                                >
                                    난이도 순
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy("pointActivity");
                                        setIsSortDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${sortBy === "pointActivity" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                        }`}
                                >
                                    활동성 순
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy("pointFear");
                                        setIsSortDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 last:rounded-b-lg ${sortBy === "pointFear" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
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
                        filteredThemes.map((theme, index) => {
                            // Calculate which ad to show (cycle through ads)
                            const adIndex = Math.floor(index / 5) % advertisements.length;
                            const shouldShowAd = (index + 1) % 5 === 0 && index !== filteredThemes.length - 1 && advertisements.length > 0;

                            return (
                                <div key={`${theme.branchId}-${theme.id}-${index}`}>
                                    <ThemeCard theme={theme} onClick={() => handleThemeClick(theme)} />
                                    {/* Show AdBanner every 5 items */}
                                    {shouldShowAd && (
                                        <div className="mt-4">
                                            <AdBanner advertisement={advertisements[adIndex]} />
                                        </div>
                                    )}
                                </div>
                            );
                        })
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
