"use client";

import { useState, useEffect } from "react";
import { User, Bell, ChevronRight, Settings, Edit2, PlusCircle, Shield, ShieldCheck, Trash2 } from "lucide-react";
import { useUserStore, useEscapeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import ReportCafeModal from "@/components/ReportCafeModal";
import ReportThemeModal from "@/components/ReportThemeModal";
import AdminApprovalModal from "@/components/AdminApprovalModal";
import DeleteCafeModal from "@/components/DeleteCafeModal";

export default function ProfilePage() {
    const { nickname, notificationsEnabled, isAdmin, setNickname, toggleNotifications, toggleAdmin } =
        useUserStore();
    const { pendingBranches } = useEscapeStore();

    const [isEditing, setIsEditing] = useState(false);
    const [tempNickname, setTempNickname] = useState("");
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isThemeReportModalOpen, setIsThemeReportModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Hydration fix
    useEffect(() => {
        setMounted(true);
        setTempNickname(nickname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nickname]);

    const handleSaveNickname = () => {
        if (tempNickname.trim()) {
            setNickname(tempNickname.trim());
            setIsEditing(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white px-4 py-4 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            </div>

            <div className="p-4">
                {/* Profile Card */}
                <div className="mb-6 flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <User className="h-12 w-12" />
                    </div>

                    {isEditing ? (
                        <div className="flex w-full max-w-xs items-center gap-2">
                            <input
                                type="text"
                                value={tempNickname}
                                onChange={(e) => setTempNickname(e.target.value)}
                                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-center text-lg font-bold focus:border-blue-500 focus:outline-none"
                                autoFocus
                            />
                            <button
                                onClick={handleSaveNickname}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                저장
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-gray-900">{nickname}</h2>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <p className="mt-1 text-sm text-gray-500">Escape Room Explorer</p>

                    {/* Admin Toggle (For Testing) */}
                    <button
                        onClick={toggleAdmin}
                        className={cn(
                            "mt-4 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                            isAdmin
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        )}
                    >
                        {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                        {isAdmin ? "관리자 모드 ON" : "관리자 모드 OFF"}
                    </button>
                </div>

                {/* Settings Section */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                    {/* Notification Setting */}
                    <div className="flex items-center justify-between border-b border-gray-100 p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">알림 설정</p>
                                <p className="text-xs text-gray-500">
                                    새로운 방탈출 소식 받기
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleNotifications}
                            className={cn(
                                "relative h-7 w-12 rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
                                notificationsEnabled ? "bg-blue-600" : "bg-gray-200"
                            )}
                        >
                            <span
                                className={cn(
                                    "absolute left-1 top-1 h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out",
                                    notificationsEnabled ? "translate-x-5" : "translate-x-0"
                                )}
                            />
                        </button>
                    </div>

                    {/* Admin Approval Menu */}
                    {isAdmin && (
                        <div
                            onClick={() => setIsAdminModalOpen(true)}
                            className="flex items-center justify-between border-b border-gray-100 p-4 hover:bg-gray-50 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative rounded-full bg-indigo-100 p-2 text-indigo-600">
                                    <ShieldCheck className="h-5 w-5" />
                                    {pendingBranches.length > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                                            {pendingBranches.length}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">제보 승인 관리</p>
                                    <p className="text-xs text-gray-500">대기 중인 제보를 검토합니다</p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    )}

                    {/* Delete Cafe Menu (Admin Only) */}
                    {isAdmin && (
                        <div
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="flex items-center justify-between border-b border-gray-100 p-4 hover:bg-gray-50 cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-red-100 p-2 text-red-600">
                                    <Trash2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">지점 삭제 관리</p>
                                    <p className="text-xs text-gray-500">등록된 지점을 삭제합니다</p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                    )}


                    {/* Other Settings (Mock) */}
                    <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-gray-100 p-2 text-gray-600">
                                <Settings className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">앱 설정</p>
                                <p className="text-xs text-gray-500">버전 1.0.0</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    {/* Report Branch Button */}
                    <div
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                                <PlusCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">방탈출 카페 제보</p>
                                <p className="text-xs text-gray-500">새로운 방탈출 카페를 공유해주세요</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>

                    {/* Report Theme Button */}
                    <div
                        onClick={() => setIsThemeReportModalOpen(true)}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-2 text-green-600">
                                <PlusCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">테마 제보</p>
                                <p className="text-xs text-gray-500">기존 카페에 새 테마를 추가해주세요</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            <ReportCafeModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />

            <ReportThemeModal
                isOpen={isThemeReportModalOpen}
                onClose={() => setIsThemeReportModalOpen(false)}
            />

            <AdminApprovalModal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
            />

            <DeleteCafeModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
}
