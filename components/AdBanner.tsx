"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Advertisement } from "@/types";

interface AdBannerProps {
    advertisement: Advertisement;
}

export default function AdBanner({ advertisement }: AdBannerProps) {
    return (
        <a
            href={advertisement.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm transition-all hover:shadow-md sm:flex-row sm:min-h-48"
        >
            {/* Image Section */}
            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-100 sm:h-auto sm:w-40">
                <Image
                    src={advertisement.imageUrl}
                    alt={advertisement.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 160px"
                />
                <div className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-bold text-white">
                    AD
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                    {/* Title */}
                    <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-1">
                        {advertisement.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                        {advertisement.description}
                    </p>
                </div>

                {/* Link Button */}
                <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                    <ExternalLink className="h-4 w-4" />
                    {advertisement.linkText}
                </div>
            </div>
        </a>
    );
}
