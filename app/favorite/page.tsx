"use client";

import { useState, useEffect } from "react";
import { useFavoriteStore, useEscapeStore } from "@/lib/store";
import ThemeCard from "@/components/ThemeCard";
import { Heart } from "lucide-react";
import { EscapeThemeDisplay } from "@/types";

export default function FavoritePage() {
    const { favorites } = useFavoriteStore();
    const { getAllThemes } = useEscapeStore();
    const [mounted, setMounted] = useState(false);
    const [favoriteThemes, setFavoriteThemes] = useState<EscapeThemeDisplay[]>([]);

    // Hydration fix: wait for component to mount before showing favorites
    // This prevents mismatch between server (empty) and client (local storage)
    useEffect(() => {
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (mounted) {
            const allThemes = getAllThemes();
            const filtered = allThemes.filter((theme) => favorites.includes(theme.id));
            setFavoriteThemes(filtered);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, favorites]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
                <p className="mt-1 text-sm text-gray-500">
                    {favoriteThemes.length}개의 테마를 저장했습니다.
                </p>
            </div>

            <div className="p-4">
                <div className="flex flex-col gap-4">
                    {favoriteThemes.length > 0 ? (
                        favoriteThemes.map((theme) => (
                            <ThemeCard key={theme.id} theme={theme} />
                        ))
                    ) : (
                        <div className="mt-20 flex flex-col items-center justify-center text-center">
                            <div className="mb-4 rounded-full bg-gray-100 p-4">
                                <Heart className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                                아직 저장한 테마가 없어요
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                마음에 드는 방탈출 테마를 찾아 하트 버튼을 눌러보세요!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
