"use client";

import { X, Check, Trash2, MapPin } from "lucide-react";
import { useEscapeStore } from "@/lib/store";

interface AdminApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminApprovalModal({ isOpen, onClose }: AdminApprovalModalProps) {
    const { pendingBranches, approveBranch, rejectBranch } = useEscapeStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">제보 승인 관리</h2>
                        <p className="text-xs text-gray-500">대기 중인 제보: {pendingBranches.length}건</p>
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
                    {pendingBranches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <p>대기 중인 제보가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingBranches.map((branch) => (
                                <div
                                    key={branch.id}
                                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{branch.brandName} <span className="text-sm font-normal text-gray-500">{branch.branchName}</span></h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                <span>{branch.address}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => rejectBranch(branch.id)}
                                                className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-colors"
                                                title="거절"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => approveBranch(branch.id)}
                                                className="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100 transition-colors"
                                                title="승인"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Theme Preview */}
                                    {branch.themes.length > 0 && (
                                        <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs font-bold text-gray-700 mb-1">대표 테마: {branch.themes[0].name}</p>
                                            <p className="text-xs text-gray-600 line-clamp-2">{branch.themes[0].description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
