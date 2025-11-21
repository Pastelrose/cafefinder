"use client";

import { X, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCafeStore } from "@/lib/store";

interface DeleteCafeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteCafeModal({ isOpen, onClose }: DeleteCafeModalProps) {
    const { cafes, deleteCafe } = useCafeStore();

    if (!isOpen) return null;

    const handleDelete = (cafeId: string, cafeName: string) => {
        if (confirm(`"${cafeName}" 카페를 정말 삭제하시겠습니까?`)) {
            deleteCafe(cafeId);
            alert("카페가 삭제되었습니다.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">카페 삭제 관리</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Cafe List */}
                <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(80vh - 80px)" }}>
                    {cafes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <p className="text-sm">등록된 카페가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {cafes.map((cafe) => (
                                <div
                                    key={cafe.id}
                                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                                >
                                    {/* Cafe Image */}
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                        <Image
                                            src={cafe.images[0]}
                                            alt={cafe.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Cafe Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{cafe.name}</h3>
                                        <p className="text-sm text-gray-500 truncate">{cafe.address}</p>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(cafe.id, cafe.name)}
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
