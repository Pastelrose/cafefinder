import { ExternalLink } from "lucide-react";

export default function AdBanner() {
    return (
        <div className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
                <span className="text-xs font-bold text-gray-500">Sponsored</span>
                <ExternalLink className="h-3 w-3 text-gray-400" />
            </div>
            <div className="flex items-center gap-4 p-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-2xl">
                    ☕
                </div>
                <div className="flex flex-col">
                    <h3 className="font-bold text-gray-900">프리미엄 원두 정기구독</h3>
                    <p className="text-sm text-gray-600">
                        집에서 즐기는 바리스타의 맛, 첫 달 50% 할인!
                    </p>
                    <span className="mt-1 text-xs text-blue-600 font-medium">
                        지금 확인하기 &rarr;
                    </span>
                </div>
            </div>
        </div>
    );
}
