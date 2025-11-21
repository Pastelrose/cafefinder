"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";
import { Star, MapPin, Globe, Heart } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useFavoriteStore, useCafeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Cafe } from "@/types";

// Fix Leaflet icon issue
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Cluster Icon
const createClusterCustomIcon = function (cluster: any) {
    return L.divIcon({
        html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
        className: "custom-marker-cluster",
        iconSize: L.point(33, 33, true),
    });
};

// Custom Photo Pin Icon
const createPhotoIcon = (imageUrl: string) => {
    return L.divIcon({
        className: "custom-photo-pin",
        html: `
      <div class="pin-inner">
        <img src="${imageUrl}" alt="cafe" />
      </div>
      <div class="pin-tip"></div>
    `,
        iconSize: [48, 54], // Width, Height (including tip)
        iconAnchor: [24, 54], // Center bottom
        popupAnchor: [0, -50],
    });
};

// Component to handle zoom events
function ZoomHandler({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
    const map = useMapEvents({
        zoomend: () => {
            onZoomChange(map.getZoom());
        },
    });
    return null;
}

export default function MapComponent() {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [filterOperator, setFilterOperator] = useState<"AND" | "OR">("OR");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(13);

    const { favoriteIds, addFavorite, removeFavorite, isFavorite } = useFavoriteStore();
    const { cafes } = useCafeStore();

    const allTags = useMemo(() => Array.from(new Set(cafes.flatMap((cafe) => cafe.tags))), [cafes]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const filteredCafes = cafes.filter((cafe) => {
        if (showFavoritesOnly && !isFavorite(cafe.id)) return false;

        const matchesSearch =
            cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cafe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cafe.address.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesTags = true;
        if (selectedTags.length > 0) {
            if (filterOperator === "AND") {
                matchesTags = selectedTags.every((tag) => cafe.tags.includes(tag));
            } else {
                matchesTags = selectedTags.some((tag) => cafe.tags.includes(tag));
            }
        }

        return matchesSearch && matchesTags;
    });

    const handleSearch = (query: string) => setSearchQuery(query);
    const handleFilterChange = (tags: string[], operator: "AND" | "OR") => {
        setSelectedTags(tags);
        setFilterOperator(operator);
    };

    const toggleFavorite = (e: React.MouseEvent, cafeId: string) => {
        e.stopPropagation();
        e.preventDefault();
        if (isFavorite(cafeId)) {
            removeFavorite(cafeId);
        } else {
            addFavorite(cafeId);
        }
    };

    if (!isMounted) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <p>Loading Map...</p>
            </div>
        );
    }

    const showMarkers = currentZoom >= 10;

    return (
        <div className="relative h-full w-full">
            <style jsx global>{`
        /* Cluster Icon Style */
        .custom-marker-cluster {
          background-color: rgba(59, 130, 246, 0.95);
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        /* Photo Pin Style */
        .custom-photo-pin {
          background: transparent;
        }
        
        .custom-photo-pin .pin-inner {
          width: 48px;
          height: 48px;
          border-radius: 50%; /* Circular */
          border: 3px solid white;
          background: white;
          overflow: hidden;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          position: relative;
          z-index: 2;
        }

        .custom-photo-pin .pin-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s;
        }
        
        /* Hover effect */
        .custom-photo-pin:hover .pin-inner {
          transform: scale(1.1);
          border-color: #3b82f6; /* Blue border on hover */
        }

        .custom-photo-pin .pin-tip {
          width: 12px;
          height: 12px;
          background: white;
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          box-shadow: 2px 2px 2px rgba(0,0,0,0.1);
          z-index: 1;
        }
      `}</style>

            <div className="absolute left-0 right-0 top-0 z-[1000] p-4 flex flex-col gap-2">
                <SearchBar
                    allTags={allTags}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    className="rounded-xl shadow-md"
                />
                <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={cn(
                        "self-start flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-md transition-colors",
                        showFavoritesOnly
                            ? "text-red-500 ring-2 ring-red-100"
                            : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                    <Heart className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
                    <span>{showFavoritesOnly ? "찜한 카페만" : "모든 카페"}</span>
                </button>
            </div>

            <MapContainer
                center={[37.5665, 126.978]}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ZoomHandler onZoomChange={setCurrentZoom} />

                {showMarkers && (
                    <MarkerClusterGroup
                        chunkedLoading
                        maxClusterRadius={60}
                        disableClusteringAtZoom={16}
                        iconCreateFunction={createClusterCustomIcon}
                    >
                        {filteredCafes.map((cafe) => {
                            // Defensive check for invalid coordinates
                            if (typeof cafe.lat !== 'number' || typeof cafe.lng !== 'number') return null;

                            return (
                                <Marker
                                    key={cafe.id}
                                    position={[cafe.lat, cafe.lng]}
                                    icon={createPhotoIcon(cafe.images[0])}
                                >
                                    <Popup className="custom-popup" minWidth={300}>
                                        <div className="flex w-[300px] gap-3 overflow-hidden rounded-lg">
                                            <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                <Image
                                                    src={cafe.images[0]}
                                                    alt={cafe.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col py-1">
                                                <div className="mb-1 flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{cafe.name}</h3>
                                                        <div className="flex items-center gap-1 text-yellow-500">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            <span className="text-xs font-medium">{cafe.rating}</span>
                                                            <span className="text-xs text-gray-400">({cafe.reviews})</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => toggleFavorite(e, cafe.id)}
                                                        className="rounded-full p-1 hover:bg-gray-100"
                                                    >
                                                        <Heart
                                                            className={cn(
                                                                "h-4 w-4 transition-colors",
                                                                isFavorite(cafe.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                                                            )}
                                                        />
                                                    </button>
                                                </div>

                                                <div className="mt-auto space-y-1">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <MapPin className="h-3 w-3" />
                                                        <span className="truncate">{cafe.address}</span>
                                                    </div>
                                                    {cafe.websiteUrl && (
                                                        <a
                                                            href={cafe.websiteUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                                                        >
                                                            <Globe className="h-3 w-3" />
                                                            <span>웹사이트 방문</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MarkerClusterGroup>
                )}
            </MapContainer>
        </div>
    );
}
