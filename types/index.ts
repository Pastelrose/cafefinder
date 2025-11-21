export interface Cafe {
    id: string;
    name: string;
export interface Cafe {
    id: string;
    name: string;
    description: string;
    address: string;
    lat: number;
    lng: number;
    images: string[];
    tags: string[];
    rating: number;
    isFavorite?: boolean;
    websiteUrl?: string;
}
