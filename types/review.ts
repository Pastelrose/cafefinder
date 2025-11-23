export interface Review {
    id: string;
    themeId: string;
    nickname: string; // User's nickname
    difficulty: number;
    fear: number;
    activity: number;
    recommendation: number;
    comment: string;
    createdAt: string; // ISO string
}
