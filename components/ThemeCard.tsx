"use client";

import Image from "next/image";
import { Heart, Star, MapPin, Activity, Ghost, ThumbsUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoriteStore } from "@/lib/store";
import { EscapeThemeDisplay } from "@/types";
import { useEffect, useState } from "react";

interface ThemeCardProps {
    theme: EscapeThemeDisplay;
    onClick?: () => void;
}

interface ScoreBarProps {
    label: string;
    score: number;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
}

// Helper to render score bars
const ScoreBar = ({ label, score, icon: Icon, colorClass, bgClass }: ScoreBarProps) => (
    <div className="flex items-center gap-2 text-xs">
        <div className={cn("flex items-center gap-1 w-16 shrink-0", colorClass)}>
            <Icon className="h-3 w-3" />
            <span className="font-medium">{label}</span>
        </div>
        <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
            <div
                className={cn("h-full rounded-full transition-all duration-500", bgClass)}
                style={{ width: `${score * 10}%` }}
            />
        </div>
        <span className="w-4 text-right font-bold text-gray-700">{score}</span>
    </div>
);

export default function ThemeCard({ theme, onClick }: ThemeCardProps) {
    const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isLiked = mounted ? isFavorite(theme.id) : false;

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLiked) {
            removeFavorite(theme.id);
        } else {
            addFavorite(theme.id);
        }
    };

    return (
        <div
            onClick={onClick}
            className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md sm:flex-row sm:min-h-48"
        >
            {/* Image Section */}
            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-100 sm:h-auto sm:w-40">
                <Image
                    src={theme.posterUrl}
                    alt={theme.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 160px"
                />
                <button
                    onClick={handleFavoriteClick}
                    className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                >
                    <Heart
                        className={cn(
                            "h-5 w-5 transition-colors",
                            isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                        )}
                    />
                </button>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                    {/* Header: Brand & Branch */}
                    <div className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{theme.brandName} {theme.branchName}</span>
                    </div>

                    {/* Title: Theme Name */}
                    <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-1">
                        {theme.name}
                    </h3>

                    {/* Tags */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {theme.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <ScoreBar label="난이도" score={theme.difficulty} icon={Star} colorClass="text-yellow-500" bgClass="bg-yellow-500" />
                    <ScoreBar label="공포도" score={theme.fear} icon={Ghost} colorClass="text-purple-500" bgClass="bg-purple-500" />
                    <ScoreBar label="활동성" score={theme.activity} icon={Activity} colorClass="text-blue-500" bgClass="bg-blue-500" />
                    <ScoreBar label="추천도" score={theme.recommendation} icon={ThumbsUp} colorClass="text-green-500" bgClass="bg-green-500" />
                </div>

                {/* Homepage Link */}
                {theme.websiteUrl && (
                    <a
                        href={theme.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 mb-4 flex items-center justify-center gap-2 rounded-lg bg-blue-50 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    >
                        <ExternalLink className="h-4 w-4" />
                        홈페이지 방문
                    </a>
                )}
            </div>
        </div>
    );
}
