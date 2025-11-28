import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EscapeBranch, EscapeThemeDisplay } from "@/types";
import { branchApi, themeApi } from "@/lib/api";

// --- User Store ---
interface UserStore {
    nickname: string;
    notificationsEnabled: boolean;
    isAdmin: boolean;
    setNickname: (nickname: string) => void;
    toggleNotifications: () => void;
    toggleAdmin: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            nickname: "Escaper",
            notificationsEnabled: true,
            isAdmin: false,
            setNickname: (nickname) => set({ nickname }),
            toggleNotifications: () =>
                set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
            toggleAdmin: () => set((state) => ({ isAdmin: !state.isAdmin })),
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// --- Favorite Store ---
interface FavoriteStore {
    favorites: string[]; // List of Theme IDs
    addFavorite: (themeId: string) => void;
    removeFavorite: (themeId: string) => void;
    isFavorite: (themeId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (themeId) =>
                set((state) => ({ favorites: [...state.favorites, themeId] })),
            removeFavorite: (themeId) =>
                set((state) => ({
                    favorites: state.favorites.filter((id) => id !== themeId),
                })),
            isFavorite: (themeId) => get().favorites.includes(themeId),
        }),
        {
            name: "favorite-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// --- Escape Data Store ---
interface EscapeStore {
    branches: EscapeBranch[];
    pendingBranches: EscapeBranch[]; // For new reports (simplified for now)
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchBranches: () => Promise<void>;
    reportBranch: (branch: EscapeBranch) => void;
    approveBranch: (branchId: string) => void;
    rejectBranch: (branchId: string) => void;
    deleteBranch: (branchId: string) => void;

    // Selectors
    getAllThemes: () => Promise<EscapeThemeDisplay[]>;
}

export const useEscapeStore = create<EscapeStore>()(
    persist(
        (set, get) => ({
            branches: [],
            pendingBranches: [],
            isLoading: false,
            error: null,

            fetchBranches: async () => {
                set({ isLoading: true, error: null });
                try {
                    const data = await branchApi.getAll();
                    // Transform backend data to frontend format
                    const branches: EscapeBranch[] = data.map((branch: any) => ({
                        id: String(branch.id),
                        brandName: branch.brandName,
                        branchName: branch.branchName,
                        address: branch.address,
                        lat: branch.latitude,
                        lng: branch.longitude,
                        websiteUrl: branch.websiteUrl,
                        phone: branch.phone,
                        themes: branch.themes ? branch.themes.map((theme: any) => ({
                            id: String(theme.id),
                            name: theme.name,
                            description: theme.description,
                            posterUrl: theme.posterUrl,
                            pointDifficulty: theme.pointDifficulty,
                            pointFear: theme.pointFear,
                            pointActivity: theme.pointActivity,
                            pointRecommendation: theme.pointRecommendation,
                            tags: theme.tags ? theme.tags.split(',') : []
                        })) : []
                    }));
                    set({ branches, isLoading: false });
                } catch (error) {
                    set({ error: (error as Error).message, isLoading: false });
                }
            },

            reportBranch: (branch) => {
                set((state) => ({ pendingBranches: [...state.pendingBranches, branch] }));
            },

            approveBranch: (branchId) => {
                const { pendingBranches, branches } = get();
                const branchToApprove = pendingBranches.find((b) => b.id === branchId);

                if (branchToApprove) {
                    set({
                        branches: [...branches, branchToApprove],
                        pendingBranches: pendingBranches.filter((b) => b.id !== branchId),
                    });
                }
            },

            rejectBranch: (branchId) => {
                set((state) => ({
                    pendingBranches: state.pendingBranches.filter((b) => b.id !== branchId),
                }));
            },

            deleteBranch: (branchId) => {
                set((state) => ({
                    branches: state.branches.filter((b) => b.id !== branchId),
                }));
            },

            getAllThemes: async () => {
                const { branches } = get();

                // If no branches loaded yet, try to fetch them
                if (branches.length === 0) {
                    await get().fetchBranches();
                }

                try {
                    // Fetch all themes from API
                    const themesData = await themeApi.getAll();
                    const allThemes: EscapeThemeDisplay[] = [];

                    // Transform and merge with branch data
                    themesData.forEach((theme: any) => {
                        const branch = get().branches.find(b => String(b.id) === String(theme.branchId));
                        if (branch) {
                            allThemes.push({
                                id: String(theme.id),
                                name: theme.name,
                                description: theme.description,
                                posterUrl: theme.posterUrl,
                                pointDifficulty: theme.pointDifficulty,
                                pointFear: theme.pointFear,
                                pointActivity: theme.pointActivity,
                                pointRecommendation: theme.pointRecommendation,
                                tags: theme.tags ? theme.tags.split(',') : [],
                                branchId: branch.id,
                                brandName: branch.brandName,
                                branchName: branch.branchName,
                                address: branch.address,
                                location: { lat: branch.lat, lng: branch.lng },
                                websiteUrl: branch.websiteUrl,
                            });
                        }
                    });

                    return allThemes;
                } catch (error) {
                    console.error('Failed to fetch themes:', error);
                    return [];
                }
            },
        }),
        {
            name: "escape-data-storage",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState: unknown, currentState) => {
                // Always use fresh initial data to ensure schema updates are applied
                // Only preserve user-added branches (pendingBranches)
                const persisted = persistedState as Partial<EscapeStore>;

                return {
                    ...currentState,
                    branches: currentState.branches, // Always use fresh initial data
                    pendingBranches: persisted.pendingBranches || [],
                };
            },
        }
    )
);
