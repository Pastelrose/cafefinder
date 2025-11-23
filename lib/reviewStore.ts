import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Review } from "@/types/review";

interface ReviewStore {
    reviews: Review[];
    addReview: (review: Review) => void;
    deleteReview: (reviewId: string) => void;
    getReviewsByTheme: (themeId: string) => Review[];
    getAverageScores: (themeId: string) => {
        difficulty: number;
        fear: number;
        activity: number;
        recommendation: number;
        count: number;
    } | null;
}

export const useReviewStore = create<ReviewStore>()(
    persist(
        (set, get) => ({
            reviews: [],
            addReview: (review) =>
                set((state) => ({ reviews: [review, ...state.reviews] })),
            deleteReview: (reviewId) =>
                set((state) => ({
                    reviews: state.reviews.filter((r) => r.id !== reviewId),
                })),
            getReviewsByTheme: (themeId) => {
                return get().reviews.filter((r) => r.themeId === themeId);
            },
            getAverageScores: (themeId) => {
                const themeReviews = get().reviews.filter((r) => r.themeId === themeId);
                if (themeReviews.length === 0) return null;

                const sum = themeReviews.reduce(
                    (acc, r) => ({
                        difficulty: acc.difficulty + r.difficulty,
                        fear: acc.fear + r.fear,
                        activity: acc.activity + r.activity,
                        recommendation: acc.recommendation + r.recommendation,
                    }),
                    { difficulty: 0, fear: 0, activity: 0, recommendation: 0 }
                );

                return {
                    difficulty: Number((sum.difficulty / themeReviews.length).toFixed(1)),
                    fear: Number((sum.fear / themeReviews.length).toFixed(1)),
                    activity: Number((sum.activity / themeReviews.length).toFixed(1)),
                    recommendation: Number((sum.recommendation / themeReviews.length).toFixed(1)),
                    count: themeReviews.length,
                };
            },
        }),
        {
            name: "review-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
