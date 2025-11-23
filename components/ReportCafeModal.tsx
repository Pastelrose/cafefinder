"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Search, Star, Ghost, Activity, ThumbsUp } from "lucide-react";
import { useEscapeStore } from "@/lib/store";
import { EscapeBranch, EscapeTheme } from "@/types";
import { cn } from "@/lib/utils";

interface ReportCafeModalProps {
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

export default function ReportCafeModal({ isOpen, onClose }: ReportCafeModalProps) {
    const { reportBranch } = useEscapeStore();

    // Form States
    const [brandName, setBrandName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [address, setAddress] = useState("");
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);
    const [websiteUrl, setWebsiteUrl] = useState("");

    // Theme Form State (Simplified to 1 theme for MVP)
    const [themeName, setThemeName] = useState("");
    const [themeDesc, setThemeDesc] = useState("");
    const [difficulty, setDifficulty] = useState(5);
    const [fear, setFear] = useState(0);
    const [activity, setActivity] = useState(5);
    const [recommendation, setRecommendation] = useState(5);

    // Geocoding State
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState("");

    // Reset form on close
    useEffect(() => {
        if (!isOpen) {
            setBrandName("");
            setBranchName("");
            setAddress("");
            setLat(null);
            setLng(null);
            setWebsiteUrl("");
            setThemeName("");
            setThemeDesc("");
            setDifficulty(5);
            setFear(0);
            setActivity(5);
            setRecommendation(5);
            setSearchError("");
        }
    }, [isOpen]);

    const handleAddressSearch = async () => {
        if (!address.trim()) return;

        setIsSearching(true);
        setSearchError("");

        try {
            const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
            const data = await response.json();

            if (response.ok && data.lat && data.lng) {
                setLat(data.lat);
                setLng(data.lng);
            } else {
                setSearchError("주소를 찾을 수 없습니다. 정확한 주소를 입력해주세요.");
                setLat(null);
                setLng(null);
            }
        } catch (error) {
            setSearchError("주소 검색 중 오류가 발생했습니다.");
            console.error("Geocoding error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!lat || !lng) {
            alert("주소 검색을 통해 위치를 확정해주세요.");
            return;
        }

        const newTheme: EscapeTheme = {
            id: `theme-${Date.now()}`,
            name: themeName,
            description: themeDesc,
            posterUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop", // Default
            difficulty,
            fear,
            activity,
            recommendation,
            tags: ["신규"],
        };

        const newBranch: EscapeBranch = {
            id: `branch-${Date.now()}`,
            brandName,
            branchName,
            address,
            lat,
            lng,
            websiteUrl: websiteUrl || undefined,
            themes: [newTheme],
        };

        reportBranch(newBranch);
        alert("제보가 완료되었습니다! 관리자 승인 후 지도에 표시됩니다.");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
                    <h2 className="text-lg font-bold text-gray-900">새로운 방탈출 제보</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Branch Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 border-b pb-2">지점 정보</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">브랜드명</label>
                                <input
                                    required
                                    type="text"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    placeholder="예: 셜록홈즈"
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">지점명</label>
                                <input
                                    required
                                    type="text"
                                    value={branchName}
                                    onChange={(e) => setBranchName(e.target.value)}
                                    placeholder="예: 강남 1호점"
                                    className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">주소</label>
                            <div className="flex gap-2">
                                <input
                                    required
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="도로명 주소를 입력하세요"
                                    className="flex-1 rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddressSearch}
                                    disabled={isSearching || !address}
                                    className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-300"
                                >
                                    {isSearching ? "검색 중..." : <Search className="h-4 w-4" />}
                                </button>
                            </div>
                            {searchError && <p className="mt-1 text-xs text-red-500">{searchError}</p>}
                            {lat && lng && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                                    <MapPin className="h-3 w-3" />
                                    <span>위치 확인됨</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">홈페이지 URL (선택)</label>
                            <input
                                type="url"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                placeholder="https://"
                                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Theme Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 border-b pb-2">대표 테마 정보</h3>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">테마명</label>
                            <input
                                required
                                type="text"
                                value={themeName}
                                onChange={(e) => setThemeName(e.target.value)}
                                placeholder="예: 살인사건의 전말"
                                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">테마 설명</label>
                            <textarea
                                required
                                value={themeDesc}
                                onChange={(e) => setThemeDesc(e.target.value)}
                                placeholder="테마 스토리를 간단히 입력해주세요"
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50 p-4 rounded-lg">
                            <ScoreInput label="난이도" value={difficulty} onChange={setDifficulty} icon={Star} colorClass="text-yellow-600" />
                            <ScoreInput label="공포도" value={fear} onChange={setFear} icon={Ghost} colorClass="text-purple-600" />
                            <ScoreInput label="활동성" value={activity} onChange={setActivity} icon={Activity} colorClass="text-blue-600" />
                            <ScoreInput label="추천도" value={recommendation} onChange={setRecommendation} icon={ThumbsUp} colorClass="text-green-600" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        제보하기
                    </button>
                </form>
            </div>
        </div>
    );
}
