"use client";

import { useState } from "react";
import { Star, Ghost, Activity, ThumbsUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReviewStore } from "@/lib/reviewStore";
import { useUserStore } from "@/lib/store";

interface ReviewFormProps {
    themeId: string;
    onClose: () => void;
}

interface RatingInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon: React.ElementType;
    colorClass: string;
}

const RatingInput = ({ label, value, onChange, icon: Icon, colorClass }: RatingInputProps) => {
    return (
        <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
                <div className={cn("flex items-center gap-2", colorClass)}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <span className="text-sm font-bold text-gray-700">{value}</span>
            </div>
            <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className={cn(
                    "h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-current",
                    colorClass.replace("text-", "accent-") // Simple hack to match accent color
                )}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>1</span>
                <span>10</span>
            </div>
        </div>
    );
};

export default function ReviewForm({ themeId, onClose }: ReviewFormProps) {
    const { addReview } = useReviewStore();
    const { nickname } = useUserStore();

    const [pointDifficulty, setPointDifficulty] = useState(5);
    const [pointFear, setPointFear] = useState(5);
    const [pointActivity, setPointActivity] = useState(5);
    const [pointRecommendation, setPointRecommendation] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newReview = {
            themeId,
            nickname,
            pointDifficulty,
            pointFear,
            pointActivity,
            pointRecommendation,
            comment,
        };

        try {
            await addReview(newReview);
            onClose();
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('리뷰 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b p-4">
                    <h3 className="text-lg font-bold text-gray-900">리뷰 작성</h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6 space-y-4">
                        <RatingInput
                            label="난이도"
                            value={pointDifficulty}
                            onChange={setPointDifficulty}
                            icon={Star}
                            colorClass="text-yellow-500"
                        />
                        <RatingInput
                            label="공포도"
                            value={pointFear}
                            onChange={setPointFear}
                            icon={Ghost}
                            colorClass="text-purple-500"
                        />
                        <RatingInput
                            label="활동성"
                            value={pointActivity}
                            onChange={setPointActivity}
                            icon={Activity}
                            colorClass="text-blue-500"
                        />
                        <RatingInput
                            label="추천도"
                            value={pointRecommendation}
                            onChange={setPointRecommendation}
                            icon={ThumbsUp}
                            colorClass="text-green-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            코멘트
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="테마에 대한 솔직한 후기를 남겨주세요."
                            className="h-32 w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                    >
                        작성 완료
                    </button>
                </form>
            </div>
        </div>
    );
}
