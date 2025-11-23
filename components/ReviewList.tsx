"use client";

import { useState } from "react";
import { useReviewStore } from "@/lib/reviewStore";
import { Star, Ghost, Activity, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewListProps {
    themeId: string;
}

type SortOption = "newest" | "oldest";

export default function ReviewList({ themeId }: ReviewListProps) {
    const { getReviewsByTheme } = useReviewStore();
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    const reviews = getReviewsByTheme(themeId).sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
    });

    if (reviews.length === 0) {
        return (
            <div className="py-8 text-center text-sm text-gray-500">
                아직 작성된 리뷰가 없습니다. 첫 번째 리뷰를 남겨보세요!
            </div>
        );
    }

    return (
        <div className="mt-6 border-t pt-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                    리뷰 <span className="text-blue-600">{reviews.length}</span>
                </h3>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 focus:border-blue-500 focus:outline-none"
                >
                    <option value="newest">최신순</option>
                    <option value="oldest">오래된순</option>
                </select>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="rounded-xl bg-gray-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-bold text-gray-900">{review.nickname}</span>
                            <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span>난이도 {review.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Ghost className="h-3 w-3 text-purple-500" />
                                <span>공포도 {review.fear}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3 text-blue-500" />
                                <span>활동성 {review.activity}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3 text-green-500" />
                                <span>추천 {review.recommendation}</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
