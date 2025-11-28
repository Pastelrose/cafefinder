"use client";

import { useEffect } from "react";

/**
 * Component to clear legacy localStorage data from previous versions
 * This runs once when the app loads to remove old review data
 */
export default function ClearLegacyData() {
    useEffect(() => {
        // Clear old review storage data
        if (typeof window !== 'undefined') {
            const reviewStorageKey = 'review-storage';
            const existingData = localStorage.getItem(reviewStorageKey);

            if (existingData) {
                console.log('[ClearLegacyData] Removing legacy review storage...');
                localStorage.removeItem(reviewStorageKey);
                console.log('[ClearLegacyData] Legacy review storage cleared successfully');
            }
        }
    }, []);

    return null; // This component doesn't render anything
}
