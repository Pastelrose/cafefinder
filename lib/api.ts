const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

// API Response wrapper
interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    error: {
        code: string;
        message: string;
    } | null;
}

// Branch API
export const branchApi = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/branches`);
        const result: ApiResponse<any[]> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to fetch branches');
        }
        return result.data || [];
    },

    async getById(id: number) {
        const response = await fetch(`${API_BASE_URL}/branches/${id}`);
        const result: ApiResponse<any> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to fetch branch');
        }
        return result.data;
    },

    async create(data: any) {
        const response = await fetch(`${API_BASE_URL}/branches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result: ApiResponse<any> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to create branch');
        }
        return result.data;
    },

    async delete(id: number) {
        const response = await fetch(`${API_BASE_URL}/branches/${id}/delete`, {
            method: 'POST',
        });
        const result: ApiResponse<null> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to delete branch');
        }
    },
};

// Theme API
export const themeApi = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/themes`);
        const result: ApiResponse<any[]> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to fetch themes');
        }
        return result.data || [];
    },

    async getById(id: number) {
        const response = await fetch(`${API_BASE_URL}/themes/${id}`);
        const result: ApiResponse<any> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to fetch theme');
        }
        return result.data;
    },

    async getByBranch(branchId: number) {
        const response = await fetch(`${API_BASE_URL}/branches/${branchId}/themes`);
        const result: ApiResponse<any[]> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to fetch themes');
        }
        return result.data || [];
    },
};

// Review API
export const reviewApi = {
    async getByTheme(themeId: number) {
        const response = await fetch(`${API_BASE_URL}/themes/${themeId}/reviews`);
        const result: ApiResponse<any[]> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to fetch reviews');
        }
        return result.data || [];
    },

    async create(data: any) {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            // Log response status for debugging
            console.log('Review API Response Status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Review API Error Response:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const result: ApiResponse<any> = await response.json();
            console.log('Review API Response:', result);

            if (!result.success) {
                throw new Error(result.error?.message || 'Failed to create review');
            }
            return result.data;
        } catch (error) {
            console.error('Failed to create review:', error);
            throw error;
        }
    },

    async delete(id: number) {
        const response = await fetch(`${API_BASE_URL}/reviews/${id}/delete`, {
            method: 'POST',
        });
        const result: ApiResponse<null> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to delete review');
        }
    },
};

// User API
export const userApi = {
    async register(data: { email: string; password: string; nickname: string }) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result: ApiResponse<any> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to register');
        }
        return result.data;
    },

    async login(data: { email: string; password: string }) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result: ApiResponse<any> = await response.json();
        if (!result.success) {
            throw new Error(result.error?.message || 'Failed to login');
        }
        return result.data;
    },
};
