"use client";

import { X, Trash2, MapPin } from "lucide-react";
import { useEscapeStore } from "@/lib/store";

interface DeleteCafeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteCafeModal({ isOpen, onClose }: DeleteCafeModalProps) {
    const { branches, deleteBranch } = useEscapeStore();

    if (!isOpen) return null;

    const handleDelete = (branchId: string, branchName: string) => {
        if (confirm(`"${branchName}" 지점을 정말 삭제하시겠습니까?`)) {
            deleteBranch(branchId);
            alert("지점이 삭제되었습니다.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">지점 삭제 관리</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Branch List */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(80vh - 80px)" }}>
                    {branches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <p className="text-sm">등록된 지점이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {branches.map((branch) => (
                                <div
                                    key={branch.id}
                                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                                >
                                    {/* Branch Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {branch.brandName} <span className="text-sm font-normal text-gray-500">{branch.branchName}</span>
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                            <MapPin className="h-3 w-3" />
                                            <span className="truncate">{branch.address}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">보유 테마: {branch.themes.length}개</p>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(branch.id, `${branch.brandName} ${branch.branchName}`)}
                                        className="shrink-0 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        삭제
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
