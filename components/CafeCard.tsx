"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, MapPin, Star, Globe } from "lucide-react";
import { Cafe } from "@/types";
import { cn } from "@/lib/utils";
import { useFavoriteStore } from "@/lib/store";

interface CafeCardProps {
    cafe: Cafe;
    className?: string;
}

export default function CafeCard({ cafe, className }: CafeCardProps) {
    const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
    const [mounted, setMounted] = useState(false);

    // Hydration mismatch fix: Wait until mounted to check local storage
    useEffect(() => {
        setMounted(true);
    }, []);

    // While not mounted, assume not favorite to match server render
    const isLiked = mounted ? isFavorite(cafe.id) : false;

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLiked) {
            removeFavorite(cafe.id);
        } else {
            addFavorite(cafe.id);
        }
    };

    return (
        <div
            className={cn(
                "group relative flex w-full overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md",
                className
            )}
        >
            {/* Image Section - Left Side */}
            <div className="relative w-32 min-w-[128px] sm:w-40 sm:min-w-[160px] bg-gray-100">
                <Image
                    src={cafe.images[0]}
                    alt={cafe.name}
                    fill
                    sizes="(max-width: 640px) 128px, 160px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                    onClick={toggleFavorite}
                    className={cn(
                        "absolute left-2 top-2 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-white",
                        isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"
                    )}
                >
                    <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                </button>
            </div>

            {/* Content Section - Right Side */}
            <div className="flex flex-1 flex-col p-3 sm:p-4">
                <div className="mb-1 flex items-start justify-between">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1 sm:text-lg">
                        {cafe.name}
                    </h3>
                    <div className="flex items-center shrink-0 rounded-md bg-yellow-50 px-1.5 py-0.5 ml-2">
                        <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-yellow-700">
                            {cafe.rating}
                        </span>
                    </div>
                </div>

                <div className="mb-2 flex flex-col gap-1">
                    <div className="flex items-center text-xs text-gray-500 sm:text-sm">
                        <MapPin className="mr-1 h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">{cafe.address}</span>
                    </div>

                    {/* Website Link */}
                    {cafe.websiteUrl && (
                        <a
                            href={cafe.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-blue-500 hover:text-blue-700 hover:underline w-fit"
                            onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
                        >
                            <Globe className="mr-1 h-3 w-3 shrink-0" />
                            <span className="line-clamp-1">홈페이지 방문</span>
                        </a>
                    )}
                </div>

                <p className="mb-3 line-clamp-2 text-xs text-gray-600 sm:text-sm">
                    {cafe.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-1.5">
                    {cafe.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 sm:text-xs"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
