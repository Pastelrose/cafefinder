"use client";

import React, { useState, useMemo } from "react";
import { useCafeStore } from "@/lib/store";
import { Cafe } from "@/types";
import CafeCard from "@/components/CafeCard";
import CafeModal from "@/components/CafeModal";
import SearchBar from "@/components/SearchBar";
import AdBanner from "@/components/AdBanner";

export default function ListPage() {
    const { cafes } = useCafeStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [filterOperator, setFilterOperator] = useState<"AND" | "OR">("OR");
    const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);

    // Extract all unique tags
    const allTags = useMemo(() => Array.from(new Set(cafes.flatMap((cafe) => cafe.tags))), [cafes]);

    // Filter cafes based on search and tags
    const filteredCafes = cafes.filter((cafe) => {
        const matchesSearch =
            cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cafe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cafe.address.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesTags = true;
        if (selectedTags.length > 0) {
            if (filterOperator === "AND") {
                matchesTags = selectedTags.every((tag) => cafe.tags.includes(tag));
            } else {
                matchesTags = selectedTags.some((tag) => cafe.tags.includes(tag));
            }
        }

        return matchesSearch && matchesTags;
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (tags: string[], operator: "AND" | "OR") => {
        setSelectedTags(tags);
        setFilterOperator(operator);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header & Search */}
            <div className="sticky top-0 z-10">
                <SearchBar
                    allTags={allTags}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* Cafe List */}
            <div className="p-4">
                <div className="flex flex-col gap-4">
                    {filteredCafes.length > 0 ? (
                        filteredCafes.map((cafe, index) => (
                            <React.Fragment key={cafe.id}>
                                <div
                                    onClick={() => setSelectedCafe(cafe)}
                                    className="cursor-pointer"
                                >
                                    <CafeCard cafe={cafe} />
                                </div>
                                {/* Insert AdBanner every 5 items */}
                                {(index + 1) % 5 === 0 && (
                                    <AdBanner />
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="mt-10 text-center text-gray-500">
                            <p>검색 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <CafeModal
                cafe={selectedCafe}
                isOpen={!!selectedCafe}
                onClose={() => setSelectedCafe(null)}
            />
        </div>
    );
}
