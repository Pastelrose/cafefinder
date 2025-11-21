"use client";

import { useState, useEffect } from "react";
import { cafes } from "@/lib/data";
import { useFavoriteStore } from "@/lib/store";
import CafeCard from "@/components/CafeCard";
import CafeModal from "@/components/CafeModal";
import { Cafe } from "@/types";

export default function FavoritePage() {
    const { favoriteIds } = useFavoriteStore();
    const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
    const [mounted, setMounted] = useState(false);

    // Hydration fix: wait for component to mount before showing favorites
    // This prevents mismatch between server (empty) and client (local storage)
    useEffect(() => {
        setMounted(true);
    }, []);

    const favoriteCafes = cafes.filter((cafe) => favoriteIds.includes(cafe.id));

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
                <p className="mt-1 text-sm text-gray-500">
                    {favoriteCafes.length}개의 카페를 저장했습니다.
                </p>
            </div>

            <div className="p-4">
                <div className="flex flex-col gap-4">
                    {favoriteCafes.length > 0 ? (
                        favoriteCafes.map((cafe) => (
                            <div
                                key={cafe.id}
                                onClick={() => setSelectedCafe(cafe)}
                                className="cursor-pointer"
                            >
                                <CafeCard cafe={cafe} />
                            </div>
                        ))
                    ) : (
                        <div className="mt-20 flex flex-col items-center justify-center text-center">
                            <div className="mb-4 rounded-full bg-gray-100 p-4">
                                <Heart className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                                아직 저장한 카페가 없어요
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                마음에 드는 카페를 찾아 하트 버튼을 눌러보세요!
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <CafeModal
                cafe={selectedCafe}
                isOpen={!!selectedCafe}
                onClose={() => setSelectedCafe(null)}
            />
        </div>
    );
}
