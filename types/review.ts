export interface Review {
    id: string;
    themeId: string;
    nickname: string; // User's nickname
    pointDifficulty: number;
    pointFear: number;
    pointActivity: number;
    pointRecommendation: number;
    comment: string;
    createdAt: string; // ISO string
}
