"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, MapPin, Star, Globe, Heart } from "lucide-react";
import { Cafe } from "@/types";
import { cn } from "@/lib/utils";
import { useFavoriteStore } from "@/lib/store";

interface CafeModalProps {
    cafe: Cafe | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function CafeModal({ cafe, isOpen, onClose }: CafeModalProps) {
    const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
    const isLiked = cafe ? isFavorite(cafe.id) : false;

    const toggleFavorite = () => {
        if (!cafe) return;
        if (isLiked) {
            removeFavorite(cafe.id);
        } else {
            addFavorite(cafe.id);
        }
    };

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !cafe) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/40"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Image Header */}
                <div className="relative h-64 w-full shrink-0 bg-gray-200">
                    <Image
                        src={cafe.images[0]}
                        alt={cafe.name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20">
                        <h2 className="text-2xl font-bold text-white">{cafe.name}</h2>
                        <div className="mt-1 flex items-center text-white/90">
                            <MapPin className="mr-1 h-4 w-4" />
                            <span className="text-sm">{cafe.address}</span>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Rating & Actions */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center rounded-lg bg-yellow-50 px-3 py-1.5">
                            <Star className="mr-1.5 h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-lg font-bold text-yellow-700">
                                {cafe.rating}
                            </span>
                            <span className="ml-1 text-sm text-yellow-600">/ 5.0</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={toggleFavorite}
                                className={cn(
                                    "flex items-center justify-center rounded-full border border-gray-200 p-2.5 transition-colors hover:bg-gray-50",
                                    isLiked
                                        ? "text-red-500 border-red-200 bg-red-50"
                                        : "text-gray-600 hover:text-red-500"
                                )}
                            >
                                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                            </button>
                            {cafe.websiteUrl && (
                                <a
                                    href={cafe.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <Globe className="mr-2 h-4 w-4" />
                                    홈페이지
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-bold text-gray-900">소개</h3>
                        <p className="leading-relaxed text-gray-600">{cafe.description}</p>
                    </div>

                    {/* Tags */}
                    <div>
                        <h3 className="mb-3 text-sm font-bold text-gray-900">태그</h3>
                        <div className="flex flex-wrap gap-2">
                            {cafe.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
