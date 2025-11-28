"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Star, Ghost, Activity, ThumbsUp } from "lucide-react";
import { useEscapeStore } from "@/lib/store";
import { EscapeBranch, EscapeTheme } from "@/types";
import { cn } from "@/lib/utils";

interface ReportCafeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Daum Address API types
declare global {
    interface Window {
        daum: {
            Postcode: new (options: {
                oncomplete: (data: {
                    address: string;
                    roadAddress: string;
                    jibunAddress: string;
                    zonecode: string;
                }) => void;
                width: string;
                height: string;
            }) => {
                embed: (element: HTMLElement) => void;
            };
        };
    }
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

    // Daum Address Search State
    const [showAddressSearch, setShowAddressSearch] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // Load Daum Postcode script
    useEffect(() => {
        if (isOpen && !isScriptLoaded) {
            const script = document.createElement("script");
            script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
            script.async = true;
            script.onload = () => setIsScriptLoaded(true);
            document.head.appendChild(script);
        }
    }, [isOpen, isScriptLoaded]);

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
            setShowAddressSearch(false);
        }
    }, [isOpen]);

    const handleAddressSearch = () => {
        setShowAddressSearch(true);
    };

    const handleAddressComplete = (data: {
        address: string;
        roadAddress: string;
        jibunAddress: string;
    }) => {
        const selectedAddress = data.roadAddress || data.jibunAddress;
        setAddress(selectedAddress);
        setShowAddressSearch(false);

        // Get coordinates from Kakao Geocoding API
        fetch(`/api/geocode?address=${encodeURIComponent(selectedAddress)}`)
            .then((res) => res.json())
            .then((result) => {
                if (result.lat && result.lng) {
                    setLat(result.lat);
                    setLng(result.lng);
                }
            })
            .catch((error) => {
                console.error("Geocoding error:", error);
            });
    };

    // Initialize Daum Postcode embed
    useEffect(() => {
        if (showAddressSearch && isScriptLoaded && window.daum) {
            const element = document.getElementById("daum-postcode-embed");
            if (element) {
                new window.daum.Postcode({
                    oncomplete: handleAddressComplete,
                    width: "100%",
                    height: "100%",
                }).embed(element);
            }
        }
    }, [showAddressSearch, isScriptLoaded]);

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
            posterUrl: "/escape-room-placeholder.png", // Default
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
            phone: undefined,
            themes: [newTheme],
        };

        reportBranch(newBranch);
        alert("제보가 완료되었습니다. 관리자 승인 후 지도에 표시됩니다.");
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
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">방탈출 카페 제보</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Branch Basic Info */}
                        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                            <h3 className="text-sm font-bold text-gray-700">지점 정보</h3>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    브랜드명 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    placeholder="예: 셜록홈즈"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    지점명 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={branchName}
                                    onChange={(e) => setBranchName(e.target.value)}
                                    placeholder="예: 강남 1호점"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    주소 <span className="text-red-500">*</span>
                                </label>
                                {!showAddressSearch ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleAddressSearch}
                                            className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-blue-500 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                                        >
                                            <MapPin className="h-4 w-4" />
                                            주소 검색
                                        </button>
                                        {address && (
                                            <div className="mt-2 rounded-lg bg-white border border-gray-300 p-3">
                                                <p className="text-sm text-gray-900">{address}</p>
                                                {lat && lng && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        위도: {lat.toFixed(6)}, 경도: {lng.toFixed(6)}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                                        <div id="daum-postcode-embed" className="h-96"></div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    홈페이지 URL (선택)
                                </label>
                                <input
                                    type="url"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    placeholder="예: https://example.com"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Theme Info */}
                        <div className="space-y-4 rounded-lg bg-blue-50 p-4">
                            <h3 className="text-sm font-bold text-gray-700">테마 정보 (1개)</h3>

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
                                    value={difficulty}
                                    onChange={setDifficulty}
                                    icon={Star}
                                    colorClass="text-yellow-500"
                                />
                                <ScoreInput
                                    label="공포도"
                                    value={fear}
                                    onChange={setFear}
                                    icon={Ghost}
                                    colorClass="text-purple-500"
                                />
                                <ScoreInput
                                    label="활동성"
                                    value={activity}
                                    onChange={setActivity}
                                    icon={Activity}
                                    colorClass="text-blue-500"
                                />
                                <ScoreInput
                                    label="추천도"
                                    value={recommendation}
                                    onChange={setRecommendation}
                                    icon={ThumbsUp}
                                    colorClass="text-green-500"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300"
                            disabled={!address || !lat || !lng}
                        >
                            제보하기
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
