"use client";

import { useState } from "react";
import { X, Upload, MapPin, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCafeStore } from "@/lib/store";

interface ReportCafeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReportCafeModal({ isOpen, onClose }: ReportCafeModalProps) {
    const { reportCafe } = useCafeStore();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        description: "",
        tags: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Geocoding using internal API (Kakao Local API)
            const response = await fetch(
                `/api/geocode?address=${encodeURIComponent(formData.address)}`
            );

            if (!response.ok) {
                throw new Error("Geocoding failed");
            }

            const data = await response.json();

            if (data.lat && data.lng) {
                reportCafe({
                    name: formData.name,
                    address: formData.address,
                    description: formData.description,
                    tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
                    websiteUrl: "",
                    lat: data.lat,
                    lng: data.lng,
                });

                alert("소중한 제보 감사합니다! 관리자 승인 후 등록됩니다.");
                setFormData({ name: "", address: "", description: "", tags: "" });
                onClose();
            } else {
                alert("주소를 찾을 수 없습니다. 정확한 주소를 입력해주세요.");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            alert("주소 검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">새로운 카페 제보</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex flex-col gap-4">
                        {/* Name Input */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                카페 이름 <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Coffee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    placeholder="카페 이름을 입력해주세요"
                                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Address Input */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                주소 <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    placeholder="대략적인 위치라도 좋아요"
                                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Description Input */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                카페 설명
                            </label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="어떤 점이 좋았나요? 분위기, 맛 등 자유롭게 적어주세요."
                                className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Tags Input */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                태그 (쉼표로 구분)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) =>
                                    setFormData({ ...formData, tags: e.target.value })
                                }
                                placeholder="예: 감성, 디저트맛집, 주차가능"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* Image Upload Placeholder */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                사진 첨부
                            </label>
                            <div className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-4 hover:bg-gray-100">
                                <Upload className="mb-2 h-6 w-6 text-gray-400" />
                                <p className="text-xs text-gray-500">클릭하여 사진 업로드 (선택)</p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "mt-6 w-full rounded-lg py-3 text-sm font-bold text-white transition-all",
                            isSubmitting
                                ? "cursor-not-allowed bg-gray-400"
                                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-[0.98]"
                        )}
                    >
                        {isSubmitting ? "제보 중..." : "제보하기"}
                    </button>
                </form>
            </div>
        </div>
    );
}
