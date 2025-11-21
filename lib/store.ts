import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Cafe } from "@/types";
import { cafes as initialCafes } from "@/lib/data";

// --- User Store ---
interface UserStore {
    nickname: string;
    notificationsEnabled: boolean;
    isAdmin: boolean; // Admin status
    setNickname: (nickname: string) => void;
    toggleNotifications: () => void;
    toggleAdmin: () => void; // For testing purposes
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            nickname: "CoffeeLover",
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
    favorites: string[]; // List of cafe IDs
    addFavorite: (cafeId: string) => void;
    removeFavorite: (cafeId: string) => void;
    isFavorite: (cafeId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteStore>()(
    persist(
        (set, get) => ({
            favorites: [],
            addFavorite: (cafeId) =>
                set((state) => ({ favorites: [...state.favorites, cafeId] })),
            removeFavorite: (cafeId) =>
                set((state) => ({
                    favorites: state.favorites.filter((id) => id !== cafeId),
                })),
            isFavorite: (cafeId) => get().favorites.includes(cafeId),
        }),
        {
            name: "favorite-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// --- Cafe Data Store (New) ---
interface CafeStore {
    cafes: Cafe[]; // Approved cafes
    pendingCafes: Cafe[]; // Cafes waiting for approval
    reportCafe: (cafe: Omit<Cafe, "id" | "rating" | "reviews" | "images">) => void;
    approveCafe: (cafeId: string) => void;
    rejectCafe: (cafeId: string) => void;
    deleteCafe: (cafeId: string) => void; // Delete approved cafe (admin only)
}

export const useCafeStore = create<CafeStore>()(
    persist(
        (set, get) => ({
            cafes: initialCafes, // Initialize with dummy data
            pendingCafes: [],

            reportCafe: (cafeData) => {
                const newCafe: Cafe = {
                    ...cafeData,
                    id: `new-${Date.now()}`, // Generate temporary ID
                    rating: 0, // New cafes start with 0 rating or "New" status
                    images: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"], // Default placeholder image
                };
                set((state) => ({ pendingCafes: [...state.pendingCafes, newCafe] }));
            },

            approveCafe: (cafeId) => {
                const { pendingCafes, cafes } = get();
                const cafeToApprove = pendingCafes.find((c) => c.id === cafeId);

                if (cafeToApprove) {
                    // Assign a proper rating or keep it 0
                    const approvedCafe = { ...cafeToApprove, rating: 4.5 };
                    set({
                        cafes: [...cafes, approvedCafe],
                        pendingCafes: pendingCafes.filter((c) => c.id !== cafeId),
                    });
                }
            },

            rejectCafe: (cafeId) => {
                set((state) => ({
                    pendingCafes: state.pendingCafes.filter((c) => c.id !== cafeId),
                }));
            },

            deleteCafe: (cafeId) => {
                set((state) => ({
                    cafes: state.cafes.filter((c) => c.id !== cafeId),
                }));
            },
        }),
        {
            name: "cafe-data-storage-v2", // Version bump to clear old invalid data
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState: any, currentState) => {
                // 1. Get initial cafes from the current state (which comes from lib/data.ts)
                const initialCafes = currentState.cafes;

                // 2. Get persisted cafes from storage
                const persistedCafes = persistedState.cafes || [];

                // 3. Create a Set of initial cafe IDs for efficient lookup
                const initialCafeIds = new Set(initialCafes.map((c) => c.id));

                // 4. Filter out cafes from persisted state that are already in initial data
                // (This ensures we use the latest version from lib/data.ts)
                const userAddedCafes = persistedCafes.filter((c: Cafe) => !initialCafeIds.has(c.id));

                // 5. Merge: Initial Data (Primary) + User Added Data (Secondary)
                const mergedCafes = [...initialCafes, ...userAddedCafes];

                return {
                    ...currentState,
                    ...persistedState,
                    cafes: mergedCafes,
                    // Keep pending cafes as is
                    pendingCafes: persistedState.pendingCafes || [],
                };
            },
        }
    )
);
