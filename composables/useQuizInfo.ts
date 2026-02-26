import type { ApiResponse } from "~/types/api";

export type AutocompleteField = 'categories' | 'tags';

export interface AutocompleteRequest {
    field: AutocompleteField;
    q: string;
    limit?: number;
}

export interface RecommendationsData {
    categories: string[];
    tags: string[];
}

export interface AutocompleteData {
    suggestions: string[];
}

export const useQuizInfo = () => {
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl || "http://localhost:8080";

    /**
     * Get popular/recommended categories and tags
     * Uses sorted set rankings from backend
     */
    const getRecommendations = async (limit: number = 10) => {
        try {
            const response = await $fetch<ApiResponse<RecommendationsData>>(
                `${apiUrl}/api/v1/info/quizezz/recommendations`,
                {
                    method: "GET",
                    query: { limit },
                }
            );
            return { success: true, data: response };
        } catch (error: any) {
            return {
                success: false,
                error: error.data?.message || "Failed to fetch recommendations",
                code: error.data?.code,
            };
        }
    };

    /**
     * Autocomplete search for categories or tags
     * Empty query returns popular items from sorted set
     * Non-empty query uses prefix matching from RediSearch
     */
    const autocomplete = async (
        field: AutocompleteField,
        q: string,
        limit: number = 10
    ) => {
        try {
            const response = await $fetch<ApiResponse<AutocompleteData>>(
                `${apiUrl}/api/v1/info/quizezz/autocomplete`,
                {
                    method: "POST",
                    body: {
                        field,
                        q,
                        limit: Math.min(limit, 20), // Backend enforces max 20
                    } as AutocompleteRequest,
                }
            );
            return { success: true, data: response };
        } catch (error: any) {
            return {
                success: false,
                error: error.data?.message || "Failed to fetch autocomplete suggestions",
                code: error.data?.code,
            };
        }
    };

    /**
     * Debounced autocomplete helper
     * Returns a function that can be called with the input value
     */
    const createDebouncedAutocomplete = (
        field: AutocompleteField,
        delay: number = 300
    ) => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        return (
            q: string,
            callback: (results: string[]) => void,
            limit: number = 10
        ) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(async () => {
                const result = await autocomplete(field, q, limit);
                if (result.success && result.data) {
                    callback(result.data.data.suggestions || []);
                } else {
                    callback([]);
                }
            }, delay);

            // Return cleanup function
            return () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        };
    };

    return {
        getRecommendations,
        autocomplete,
        createDebouncedAutocomplete,
    };
};
