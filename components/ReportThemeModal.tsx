"use client";

import { useState, useEffect } from "react";
import { X, Star, Ghost, Activity, ThumbsUp, MapPin } from "lucide-react";
import { useEscapeStore } from "@/lib/store";
import { EscapeTheme } from "@/types";
import { cn } from "@/lib/utils";

interface ReportThemeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ScoreInput = ({
    label,
    value,
    onChange,
    icon: Icon,
    colorClass
}: {
    label: string;
    value: number;
    onChange: (val: number) => void;
    icon: React.ElementType;
    colorClass: string;
}) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-2 text-sm font-medium", colorClass)}>
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{value}</span>
        </div>
        <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className={cn(
                "h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-current",
                colorClass
            )}
        />
        <div className="flex justify-between px-1 text-[10px] text-gray-400">
            <span>1</span>
            <span>5</span>
            <span>10</span>
        </div>
    </div>
);

export default function ReportThemeModal({ isOpen, onClose }: ReportThemeModalProps) {
    const { branches, reportBranch } = useEscapeStore();

    // Form States
    const [selectedBranchId, setSelectedBranchId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [themeName, setThemeName] = useState("");
    const [themeDesc, setThemeDesc] = useState("");
    const [pointDifficulty, setPointDifficulty] = useState(5);
    const [pointFear, setPointFear] = useState(0);
    const [pointActivity, setPointActivity] = useState(5);
    const [pointRecommendation, setPointRecommendation] = useState(5);

    // Filter branches based on search query
    const filteredBranches = branches.filter((branch) => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
            branch.brandName.toLowerCase().includes(lowerQuery) ||
            branch.branchName.toLowerCase().includes(lowerQuery) ||
            branch.address.toLowerCase().includes(lowerQuery)
        );
    });

    // Reset form on close
    useEffect(() => {
        if (!isOpen) {
            setSelectedBranchId("");
            setSearchQuery("");
            setShowResults(false);
            setThemeName("");
            setThemeDesc("");
            setPointDifficulty(5);
            setPointFear(0);
            setPointActivity(5);
            setPointRecommendation(5);
        }
    }, [isOpen]);

    const handleBranchSelect = (branchId: string) => {
        setSelectedBranchId(branchId);
        const selected = branches.find((b) => b.id === branchId);
        if (selected) {
            setSearchQuery(`${selected.brandName} - ${selected.branchName}`);
        }
        setShowResults(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBranchId) {
            alert("방탈출 카페를 선택해주세요.");
            return;
        }

        const selectedBranch = branches.find((b) => b.id === selectedBranchId);
        if (!selectedBranch) {
            alert("선택한 카페를 찾을 수 없습니다.");
            return;
        }

        const newTheme: EscapeTheme = {
            id: `theme-${Date.now()}`,
            name: themeName,
            description: themeDesc,
            posterUrl: "/escape-room-placeholder.png", // Default
            pointDifficulty,
            pointFear,
            pointActivity,
            pointRecommendation,
            tags: ["신규"],
        };

        // Create updated branch with new theme
        const updatedBranch = {
            ...selectedBranch,
            themes: [...selectedBranch.themes, newTheme],
        };

        // Report as pending (admin approval needed)
        reportBranch(updatedBranch);

        alert("테마 제보가 완료되었습니다. 관리자 승인 후 추가됩니다.");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2 transition-transform hover:scale-110 active:scale-95"
                >
                    <X className="h-5 w-5 text-gray-600" />
                </button>

                {/* Scrollable Content */}
                <div className="max-h-[90vh] overflow-y-auto p-6">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">테마 제보</h2>
                    <p className="mb-6 text-sm text-gray-600">
                        기존 방탈출 카페에 새로운 테마를 추가합니다.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Branch Selection */}
                        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                            <h3 className="text-sm font-bold text-gray-700">방탈출 카페 선택</h3>

                            <div className="relative">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    카페 검색 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowResults(true);
                                        if (!e.target.value) {
                                            setSelectedBranchId("");
                                        }
                                    }}
                                    onFocus={() => setShowResults(true)}
                                    placeholder="브랜드명, 지점명 또는 주소로 검색"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />

                                {/* Search Results Dropdown */}
                                {showResults && searchQuery && filteredBranches.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                                        {filteredBranches.map((branch) => (
                                            <button
                                                key={branch.id}
                                                type="button"
                                                onClick={() => handleBranchSelect(branch.id)}
                                                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                            >
                                                <p className="text-sm font-medium text-gray-900">
                                                    {branch.brandName} - {branch.branchName}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{branch.address}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    테마 {branch.themes.length}개
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* No Results */}
                                {showResults && searchQuery && filteredBranches.length === 0 && (
                                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-300 bg-white shadow-lg p-4">
                                        <p className="text-sm text-gray-500 text-center">
                                            검색 결과가 없습니다
                                        </p>
                                    </div>
                                )}

                                {/* Selected Branch Preview */}
                                {selectedBranchId && (
                                    <div className="mt-2 flex items-start gap-2 rounded-lg bg-white border border-gray-300 p-3">
                                        <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {branches.find((b) => b.id === selectedBranchId)?.brandName}{" "}
                                                {branches.find((b) => b.id === selectedBranchId)?.branchName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {branches.find((b) => b.id === selectedBranchId)?.address}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                현재 테마: {branches.find((b) => b.id === selectedBranchId)?.themes.length}개
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Theme Info */}
                        <div className="space-y-4 rounded-lg bg-blue-50 p-4">
                            <h3 className="text-sm font-bold text-gray-700">새 테마 정보</h3>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    테마명 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={themeName}
                                    onChange={(e) => setThemeName(e.target.value)}
                                    placeholder="예: 오리엔트 특급 살인"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    테마 설명
                                </label>
                                <textarea
                                    value={themeDesc}
                                    onChange={(e) => setThemeDesc(e.target.value)}
                                    placeholder="테마에 대한 간단한 설명을 입력해주세요"
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
                                />
                            </div>

                            {/* Score Inputs */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <ScoreInput
                                    label="난이도"
                                    value={pointDifficulty}
                                    onChange={setPointDifficulty}
                                    icon={Star}
                                    colorClass="text-yellow-500"
                                />
                                <ScoreInput
                                    label="공포도"
                                    value={pointFear}
                                    onChange={setPointFear}
                                    icon={Ghost}
                                    colorClass="text-purple-500"
                                />
                                <ScoreInput
                                    label="활동성"
                                    value={pointActivity}
                                    onChange={setPointActivity}
                                    icon={Activity}
                                    colorClass="text-blue-500"
                                />
                                <ScoreInput
                                    label="추천도"
                                    value={pointRecommendation}
                                    onChange={setPointRecommendation}
                                    icon={ThumbsUp}
                                    colorClass="text-green-500"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
                            disabled={!selectedBranchId || !themeName.trim()}
                        >
                            테마 제보하기
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
