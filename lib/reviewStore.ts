import { create } from "zustand";
import { Review } from "@/types/review";
import { reviewApi } from "@/lib/api";

interface ReviewStore {
    reviews: Review[];
    isLoading: boolean;
    addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
    deleteReview: (reviewId: string) => Promise<void>;
    fetchReviewsByTheme: (themeId: string) => Promise<void>;
    getReviewsByTheme: (themeId: string) => Review[];
    getAverageScores: (themeId: string) => {
        pointDifficulty: number;
        pointFear: number;
        pointActivity: number;
        pointRecommendation: number;
        count: number;
    } | null;
}

export const useReviewStore = create<ReviewStore>()((set, get) => ({
    reviews: [],
    isLoading: false,
            addReview: async (review) => {
                set({ isLoading: true });
                try {
                    // Call backend API to create review
                    const createdReview = await reviewApi.create({
                        themeId: Number(review.themeId),
                        userId: 1, // Placeholder, backend will use nickname instead
                        nickname: review.nickname,
                        pointDifficulty: review.pointDifficulty,
                        pointFear: review.pointFear,
                        pointActivity: review.pointActivity,
                        pointRecommendation: review.pointRecommendation,
                        comment: review.comment,
                    });

                    // Transform backend response to frontend format
                    const newReview: Review = {
                        id: String(createdReview.id),
                        themeId: String(createdReview.themeId),
                        nickname: createdReview.userNickname,
                        pointDifficulty: createdReview.pointDifficulty,
                        pointFear: createdReview.pointFear,
                        pointActivity: createdReview.pointActivity,
                        pointRecommendation: createdReview.pointRecommendation,
                        comment: createdReview.comment,
                        createdAt: createdReview.createdAt,
                    };

                    set((state) => ({
                        reviews: [newReview, ...state.reviews],
                        isLoading: false
                    }));
                } catch (error) {
                    console.error('Failed to create review:', error);
                    set({ isLoading: false });
                    throw error;
                }
            },
            deleteReview: async (reviewId) => {
                set({ isLoading: true });
                try {
                    await reviewApi.delete(Number(reviewId));
                    set((state) => ({
                        reviews: state.reviews.filter((r) => r.id !== reviewId),
                        isLoading: false,
                    }));
                } catch (error) {
                    console.error('Failed to delete review:', error);
                    set({ isLoading: false });
                    throw error;
                }
            },
            fetchReviewsByTheme: async (themeId) => {
                set({ isLoading: true });
                try {
                    const reviewsData = await reviewApi.getByTheme(Number(themeId));

                    // Transform backend data to frontend format
                    const fetchedReviews: Review[] = reviewsData.map((r: any) => ({
                        id: String(r.id),
                        themeId: String(r.themeId),
                        nickname: r.userNickname,
                        pointDifficulty: r.pointDifficulty,
                        pointFear: r.pointFear,
                        pointActivity: r.pointActivity,
                        pointRecommendation: r.pointRecommendation,
                        comment: r.comment,
                        createdAt: r.createdAt,
                    }));

                    // Replace reviews for this theme with fresh data from backend
                    set((state) => {
                        const otherThemeReviews = state.reviews.filter(r => r.themeId !== themeId);
                        return {
                            reviews: [...otherThemeReviews, ...fetchedReviews],
                            isLoading: false,
                        };
                    });
                } catch (error) {
                    console.error('Failed to fetch reviews:', error);
                    set({ isLoading: false });
                }
            },
            getReviewsByTheme: (themeId) => {
                return get().reviews.filter((r) => r.themeId === themeId);
            },
            getAverageScores: (themeId) => {
                const themeReviews = get().reviews.filter((r) => r.themeId === themeId);
                if (themeReviews.length === 0) return null;

                const sum = themeReviews.reduce(
                    (acc, r) => ({
                        pointDifficulty: acc.pointDifficulty + r.pointDifficulty,
                        pointFear: acc.pointFear + r.pointFear,
                        pointActivity: acc.pointActivity + r.pointActivity,
                        pointRecommendation: acc.pointRecommendation + r.pointRecommendation,
                    }),
                    { pointDifficulty: 0, pointFear: 0, pointActivity: 0, pointRecommendation: 0 }
                );

                return {
                    pointDifficulty: Number((sum.pointDifficulty / themeReviews.length).toFixed(1)),
                    pointFear: Number((sum.pointFear / themeReviews.length).toFixed(1)),
                    pointActivity: Number((sum.pointActivity / themeReviews.length).toFixed(1)),
                    pointRecommendation: Number((sum.pointRecommendation / themeReviews.length).toFixed(1)),
                    count: themeReviews.length,
                };
            },
}));
