"use client";

import Image from "next/image";
import { X, Heart, MapPin, Star, Ghost, Activity, ThumbsUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavoriteStore } from "@/lib/store";
import { EscapeThemeDisplay } from "@/types";
import { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { useReviewStore } from "@/lib/reviewStore";

interface ThemeDetailModalProps {
    theme: EscapeThemeDisplay | null;
    isOpen: boolean;
    onClose: () => void;
}

interface ScoreItemProps {
    label: string;
    score: number;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
}

const ScoreItem = ({ label, score, icon: Icon, colorClass, bgClass }: ScoreItemProps) => (
    <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-2", colorClass)}>
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="h-2 w-32 rounded-full bg-gray-100 overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", bgClass)}
                    style={{ width: `${score * 10}%` }}
                />
            </div>
            <span className="w-6 text-right text-sm font-bold text-gray-700">{score}</span>
        </div>
    </div>
);

export default function ThemeDetailModal({ theme, isOpen, onClose }: ThemeDetailModalProps) {
    const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
    const { getAverageScores } = useReviewStore();
    const [mounted, setMounted] = useState(false);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !theme) return null;

    const isLiked = mounted ? isFavorite(theme.id) : false;
    const averageScores = mounted ? getAverageScores(theme.id) : null;

    // Use average scores if available, otherwise fallback to theme defaults
    // Note: Theme defaults are static, reviews are dynamic user input.
    const displayScores = averageScores ? {
        difficulty: averageScores.difficulty,
        fear: averageScores.fear,
        activity: averageScores.activity,
        recommendation: averageScores.recommendation
    } : {
        difficulty: theme.difficulty,
        fear: theme.fear,
        activity: theme.activity,
        recommendation: theme.recommendation
    };

    const handleFavoriteClick = () => {
        if (isLiked) {
            removeFavorite(theme.id);
        } else {
            addFavorite(theme.id);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-[90vh]">
                        {/* Image Header */}
                        <div className="relative h-64 w-full bg-gray-100">
                            <Image
                                src={theme.posterUrl}
                                alt={theme.name}
                                fill
                                className="object-cover"
                                sizes="800px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Favorite Button */}
                            <button
                                onClick={handleFavoriteClick}
                                className="absolute right-4 bottom-4 z-10 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
                            >
                                <Heart
                                    className={cn(
                                        "h-6 w-6 transition-colors",
                                        isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                                    )}
                                />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Branch Info */}
                            <div className="mb-2 flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="h-4 w-4" />
                                <span>{theme.brandName} • {theme.branchName}</span>
                            </div>

                            {/* Theme Name */}
                            <h2 className="mb-3 text-2xl font-bold text-gray-900">{theme.name}</h2>

                            {/* Tags */}
                            <div className="mb-4 flex flex-wrap gap-2">
                                {theme.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="mb-2 text-sm font-bold text-gray-900">테마 설명</h3>
                                <p className="text-sm leading-relaxed text-gray-600">{theme.description}</p>
                            </div>

                            {/* Scores */}
                            <div className="mb-6">
                                <div className="mb-3 flex items-end gap-2">
                                    <h3 className="text-sm font-bold text-gray-900">점수</h3>
                                    {averageScores && (
                                        <span className="text-xs text-gray-500">
                                            (리뷰 {averageScores.count}개 기준)
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <ScoreItem label="난이도" score={displayScores.difficulty} icon={Star} colorClass="text-yellow-500" bgClass="bg-yellow-500" />
                                    <ScoreItem label="공포도" score={displayScores.fear} icon={Ghost} colorClass="text-purple-500" bgClass="bg-purple-500" />
                                    <ScoreItem label="활동성" score={displayScores.activity} icon={Activity} colorClass="text-blue-500" bgClass="bg-blue-500" />
                                    <ScoreItem label="추천도" score={displayScores.recommendation} icon={ThumbsUp} colorClass="text-green-500" bgClass="bg-green-500" />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                                <h3 className="mb-1 text-sm font-bold text-gray-900">위치</h3>
                                <p className="text-sm text-gray-600">{theme.address}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsReviewFormOpen(true)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                                >
                                    <Star className="h-4 w-4" />
                                    리뷰 작성
                                </button>
                                {theme.websiteUrl && (
                                    <a
                                        href={theme.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        홈페이지 방문
                                    </a>
                                )}
                            </div>

                            {/* Review List */}
                            <ReviewList themeId={theme.id} />
                        </div>
                    </div>
                </div>
            </div>

            {isReviewFormOpen && (
                <ReviewForm
                    themeId={theme.id}
                    onClose={() => setIsReviewFormOpen(false)}
                />
            )}
        </>
    );
}
