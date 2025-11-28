export interface EscapeTheme {
    id: string;
    name: string; // Theme Name (e.g. "Murder on the Orient Express")
    description: string;
    posterUrl: string; // Image URL

    // Scores (1-10)
    pointDifficulty: number;
    pointFear: number;
    pointActivity: number;
    pointRecommendation: number; // User satisfaction/recommendation score

    tags: string[];
}

export interface EscapeBranch {
    id: string;
    brandName: string; // e.g. "Sherlock Holmes"
    branchName: string; // e.g. "Gangnam 1st Branch"
    address: string;
    lat: number;
    lng: number;
    websiteUrl?: string;
    phone?: string;

    themes: EscapeTheme[]; // 1:N relationship
}

// Helper type for flat list view (Theme + Branch Info)
export interface EscapeThemeDisplay extends EscapeTheme {
    branchId: string;
    brandName: string;
    branchName: string;
    address: string;
    location: { lat: number; lng: number };
    websiteUrl?: string;
}

export interface Advertisement {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    linkUrl: string;
    linkText: string;
    displayOrder: number;
}
