"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEscapeStore } from "@/lib/store";
import { EscapeBranch } from "@/types";
import SearchBar, { FilterState } from "./SearchBar";
import Link from "next/link";

// Fix Leaflet default icon issue
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const BranchMarkerIcon = L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full shadow-lg border-2 border-white text-white">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
    className: "custom-pin-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 15, { duration: 1.5 });
    }, [center, map]);
    return null;
}

export default function MapComponent() {
    const { branches } = useEscapeStore();
    const [filteredBranches, setFilteredBranches] = useState<EscapeBranch[]>([]);
    const [mapCenter, setMapCenter] = useState<[number, number]>([37.498095, 127.027610]); // Default Gangnam
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setFilteredBranches(branches);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [branches]);

    const handleSearch = (query: string) => {
        if (!query) {
            setFilteredBranches(branches);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const filtered = branches.filter((branch) => {
            // Search by Brand, Branch, or Theme Name
            const matchBrand = branch.brandName.toLowerCase().includes(lowerQuery);
            const matchBranch = branch.branchName.toLowerCase().includes(lowerQuery);
            const matchTheme = branch.themes.some(t => t.name.toLowerCase().includes(lowerQuery));

            return matchBrand || matchBranch || matchTheme;
        });

        setFilteredBranches(filtered);

        if (filtered.length > 0) {
            setMapCenter([filtered[0].lat, filtered[0].lng]);
        }
    };

    const handleFilterChange = (filters: FilterState) => {
        // Filter logic: A branch is shown if it has AT LEAST ONE theme matching the filters
        const filtered = branches.filter((branch) => {
            return branch.themes.some((theme) => {
                const matchDiff = theme.difficulty >= filters.difficulty[0] && theme.difficulty <= filters.difficulty[1];
                const matchFear = theme.fear >= filters.fear[0] && theme.fear <= filters.fear[1];
                const matchAct = theme.activity >= filters.activity[0] && theme.activity <= filters.activity[1];
                const matchRec = theme.recommendation >= filters.recommendation[0] && theme.recommendation <= filters.recommendation[1];

                return matchDiff && matchFear && matchAct && matchRec;
            });
        });
        setFilteredBranches(filtered);
    };

    if (!mounted) return null;

    return (
        <div className="relative h-full w-full">
            {/* Search Bar Overlay */}
            <div className="absolute left-4 right-4 top-4 z-[1000] flex justify-center">
                <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
            </div>

            <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController center={mapCenter} />

                {filteredBranches.map((branch) => (
                    <Marker
                        key={branch.id}
                        position={[branch.lat, branch.lng]}
                        icon={BranchMarkerIcon}
                    >
                        <Popup className="custom-popup" minWidth={280}>
                            <div className="p-1">
                                <div className="mb-2 border-b border-gray-100 pb-2">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {branch.brandName} <span className="text-sm font-normal text-gray-500">{branch.branchName}</span>
                                    </h3>
                                    <p className="text-xs text-gray-500">{branch.address}</p>
                                </div>

                                <div className="mb-3">
                                    <p className="mb-1 text-xs font-semibold text-gray-700">보유 테마 ({branch.themes.length})</p>
                                    <div className="flex flex-wrap gap-1">
                                        {branch.themes.slice(0, 3).map((theme) => (
                                            <span key={theme.id} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
                                                {theme.name}
                                            </span>
                                        ))}
                                        {branch.themes.length > 3 && (
                                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                                                +{branch.themes.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {branch.websiteUrl && (
                                        <a
                                            href={branch.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 rounded-lg bg-blue-50 py-2 text-center text-xs font-medium text-blue-600 hover:bg-blue-100"
                                        >
                                            홈페이지
                                        </a>
                                    )}
                                    <Link
                                        href={`/list?search=${branch.brandName}`}
                                        className="flex-1 rounded-lg bg-gray-900 py-2 text-center text-xs font-medium text-white hover:bg-gray-800"
                                    >
                                        테마 보기
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
