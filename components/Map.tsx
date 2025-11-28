"use client";

import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
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

// Create cluster icon with count
const createClusterIcon = (count: number) => {
    return L.divIcon({
        html: `<div class="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full shadow-lg border-3 border-white text-white font-bold text-sm">
        ${count}
      </div>`,
        className: "cluster-icon",
        iconSize: [48, 48],
        iconAnchor: [24, 24],
    });
};

function MapController({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 15, { duration: 1.5 });
    }, [center, map]);
    return null;
}

// Component to track zoom level
function ZoomTracker({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
    const map = useMapEvents({
        zoomend: () => {
            onZoomChange(map.getZoom());
        },
    });

    useEffect(() => {
        onZoomChange(map.getZoom());
    }, [map, onZoomChange]);

    return null;
}

// Simple clustering function based on distance
function clusterBranches(branches: EscapeBranch[], distance: number = 0.05): Array<{ lat: number; lng: number; branches: EscapeBranch[] }> {
    const clusters: Array<{ lat: number; lng: number; branches: EscapeBranch[] }> = [];
    const used = new Set<string>();

    branches.forEach((branch) => {
        if (used.has(branch.id)) return;

        const cluster = {
            lat: branch.lat,
            lng: branch.lng,
            branches: [branch],
        };

        branches.forEach((other) => {
            if (used.has(other.id) || branch.id === other.id) return;

            const dist = Math.sqrt(
                Math.pow(branch.lat - other.lat, 2) +
                Math.pow(branch.lng - other.lng, 2)
            );

            if (dist < distance) {
                cluster.branches.push(other);
                cluster.lat = (cluster.lat * cluster.branches.length + other.lat) / (cluster.branches.length + 1);
                cluster.lng = (cluster.lng * cluster.branches.length + other.lng) / (cluster.branches.length + 1);
                used.add(other.id);
            }
        });

        used.add(branch.id);
        clusters.push(cluster);
    });

    return clusters;
}

export default function MapComponent() {
    const { branches, fetchBranches } = useEscapeStore();
    const [filteredBranches, setFilteredBranches] = useState<EscapeBranch[]>([]);
    const [mapCenter, setMapCenter] = useState<[number, number]>([37.498095, 127.027610]); // Default Gangnam
    const [mounted, setMounted] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(13);

    useEffect(() => {
        setMounted(true);
        // Load branches from API
        fetchBranches();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Initialize filtered branches when branches change
    useEffect(() => {
        setFilteredBranches(branches);
        if (branches.length > 0) {
            setMapCenter([branches[0].lat, branches[0].lng]);
        }
    }, [branches]);

    const handleSearch = useCallback((query: string) => {
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
    }, [branches]);

    const handleFilterChange = useCallback((filters: FilterState) => {
        // Filter branches based on theme scores
        const filtered = branches.filter((branch) => {
            // A branch is included if it has at least one theme matching all filters
            return branch.themes.some((theme) => {
                const matchDifficulty = theme.pointDifficulty >= filters.pointDifficulty[0] &&
                                       theme.pointDifficulty <= filters.pointDifficulty[1];
                const matchFear = theme.pointFear >= filters.pointFear[0] &&
                                 theme.pointFear <= filters.pointFear[1];
                const matchActivity = theme.pointActivity >= filters.pointActivity[0] &&
                                     theme.pointActivity <= filters.pointActivity[1];
                const matchRecommendation = theme.pointRecommendation >= filters.pointRecommendation[0] &&
                                           theme.pointRecommendation <= filters.pointRecommendation[1];

                return matchDifficulty && matchFear && matchActivity && matchRecommendation;
            });
        });

        setFilteredBranches(filtered);

        if (filtered.length > 0) {
            setMapCenter([filtered[0].lat, filtered[0].lng]);
        }
    }, [branches]);

    const handleZoomChange = useCallback((zoom: number) => {
        setCurrentZoom(zoom);
    }, []);

    if (!mounted) return null;

    // Zoom level thresholds
    const MIN_ZOOM_TO_SHOW = 13; // Below this, show nothing
    const CLUSTER_ZOOM = 16; // Below this (but above MIN_ZOOM_TO_SHOW), show clusters (i.e., 13-15)

    const showNothing = currentZoom < MIN_ZOOM_TO_SHOW;
    const showClusters = currentZoom >= MIN_ZOOM_TO_SHOW && currentZoom < CLUSTER_ZOOM;
    const showMarkers = currentZoom >= CLUSTER_ZOOM;

    const clusters = showClusters ? clusterBranches(filteredBranches) : [];

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
                <ZoomTracker onZoomChange={handleZoomChange} />

                {/* Render individual markers at high zoom */}
                {showMarkers && filteredBranches.map((branch) => (
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
                                            className="flex-1 rounded-lg bg-white border-2 border-blue-300 py-2 text-center text-xs font-medium text-blue-600 hover:bg-blue-50"
                                        >
                                            홈페이지
                                        </a>
                                    )}
                                    <Link
                                        href={`/list?search=${encodeURIComponent(branch.brandName)}`}
                                        className="flex-1 rounded-lg bg-white border-2 border-blue-500 py-2 text-center text-xs font-medium text-blue-600 hover:bg-blue-50"
                                    >
                                        테마 보기
                                    </Link>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Render clusters at medium zoom */}
                {showClusters && clusters.map((cluster, idx) => (
                    <Marker
                        key={`cluster-${idx}`}
                        position={[cluster.lat, cluster.lng]}
                        icon={createClusterIcon(cluster.branches.length)}
                    >
                        <Popup className="custom-popup" minWidth={280}>
                            <div className="p-2">
                                <h3 className="mb-2 text-sm font-bold text-gray-900">
                                    이 지역의 지점 ({cluster.branches.length}개)
                                </h3>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    {cluster.branches.map((branch) => (
                                        <div key={branch.id} className="text-xs">
                                            <p className="font-medium text-gray-800">{branch.brandName} {branch.branchName}</p>
                                            <p className="text-gray-500">{branch.themes.length}개 테마</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-2 text-xs text-gray-500">확대하여 개별 지점을 확인하세요</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
