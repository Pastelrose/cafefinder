"use client";

import { X, Check, Trash2, MapPin, ExternalLink } from "lucide-react";
import { useCafeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface AdminApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminApprovalModal({ isOpen, onClose }: AdminApprovalModalProps) {
    const { pendingCafes, approveCafe, rejectCafe } = useCafeStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">제보 승인 관리</h2>
                        <p className="text-xs text-gray-500">대기 중인 제보: {pendingCafes.length}건</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4">
                    {pendingCafes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <p>대기 중인 제보가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingCafes.map((cafe) => (
                                <div
                                    key={cafe.id}
                                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{cafe.name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{cafe.address}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => rejectCafe(cafe.id)}
                                                className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                                                title="거절"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => approveCafe(cafe.id)}
                                                className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100 transition-colors"
                                                title="승인"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {cafe.description && (
                                        <p className="mb-3 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                            {cafe.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-1">
                                        {cafe.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
