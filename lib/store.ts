import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { EscapeBranch, EscapeThemeDisplay } from "@/types";
import { escapeBranches as initialBranches } from "@/lib/data";

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

    // Actions
    reportBranch: (branch: EscapeBranch) => void;
    approveBranch: (branchId: string) => void;
    rejectBranch: (branchId: string) => void;
    deleteBranch: (branchId: string) => void;

    // Selectors
    getAllThemes: () => EscapeThemeDisplay[];
}

export const useEscapeStore = create<EscapeStore>()(
    persist(
        (set, get) => ({
            branches: initialBranches,
            pendingBranches: [],

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

            getAllThemes: () => {
                const { branches } = get();
                const allThemes: EscapeThemeDisplay[] = [];

                branches.forEach((branch) => {
                    branch.themes.forEach((theme) => {
                        allThemes.push({
                            ...theme,
                            branchId: branch.id,
                            brandName: branch.brandName,
                            branchName: branch.branchName,
                            address: branch.address,
                            location: { lat: branch.lat, lng: branch.lng },
                            websiteUrl: branch.websiteUrl,
                        });
                    });
                });

                return allThemes;
            },
        }),
        {
            name: "escape-data-storage",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState: unknown, currentState) => {
                // Simple merge strategy: Always prioritize initial data for existing IDs
                // This is a simplified version of the previous logic
                const initialBranches = currentState.branches;
                const persisted = persistedState as Partial<EscapeStore>;
                const persistedBranches = persisted.branches || [];
                const initialIds = new Set(initialBranches.map((b) => b.id));
                const userAddedBranches = persistedBranches.filter((b: EscapeBranch) => !initialIds.has(b.id));

                return {
                    ...currentState,
                    ...persisted,
                    branches: [...initialBranches, ...userAddedBranches],
                    pendingBranches: persisted.pendingBranches || [],
                };
            },
        }
    )
);
