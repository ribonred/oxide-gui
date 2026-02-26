import type { ApiResponse, PaginatedResponseData } from "~/types/api";

export const useParticipants = () => {
  const config = useRuntimeConfig();
  const { authFetch } = useAuth();

  const apiUrl = config.public.apiUrl || "http://localhost:8080";

  const getParticipants = async (params?: {
    page?: number;
    per_page?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page)
        queryParams.append("perPage", params.per_page.toString());

      const url = `${apiUrl}/api/v1/participants${
        queryParams.toString() ? `?${queryParams}` : ""
      }`;

      const response = await authFetch<PaginatedResponseData<any>>(url, {
        method: "GET",
      });
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to fetch participants",
        code: error.data?.code,
      };
    }
  };

  const getParticipantById = async (id: string) => {
    try {
      const response = await authFetch<ApiResponse<any>>(
        `${apiUrl}/api/v1/participants/${id}`,
        {
          method: "GET",
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to fetch participant",
        code: error.data?.code,
      };
    }
  };

  const createParticipant = async (participantData: any) => {
    try {
      const response = await authFetch<ApiResponse<any>>(
        `${apiUrl}/api/v1/participants`,
        {
          method: "POST",
          body: participantData,
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to create participant",
        code: error.data?.code,
      };
    }
  };

  const updateParticipant = async (id: string, participantData: any) => {
    try {
      const response = await authFetch<ApiResponse<any>>(
        `${apiUrl}/api/v1/participants/${id}`,
        {
          method: "PUT",
          body: participantData,
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to update participant",
        code: error.data?.code,
      };
    }
  };

  const deleteParticipant = async (id: string) => {
    try {
      const response = await authFetch<ApiResponse<any>>(
        `${apiUrl}/api/v1/participants/${id}`,
        {
          method: "DELETE",
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to delete participant",
        code: error.data?.code,
      };
    }
  };

  const exportParticipantsCsv = async (apiKeyName?: string) => {
    try {
      const { authToken } = useAuth();
      const token = authToken.value;

      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      const response = await fetch(`${apiUrl}/api/v1/participants/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ api_key: apiKeyName || null }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "Failed to export participants",
        };
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "participants.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to export participants",
      };
    }
  };

  const bulkImportParticipantsCsv = async (file: File) => {
    try {
      const { authToken } = useAuth();
      const token = authToken.value;

      if (!token) {
        return { success: false, error: "Not authenticated" };
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${apiUrl}/api/v1/participants/bulk-import`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Failed to import participants",
          code: data.code,
        };
      }

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to import participants",
      };
    }
  };

  const bulkCreateParticipantsJson = async (
    participants: Array<{
      alias: string;
      external_id: string;
      email?: string;
      metadata?: Record<string, any>;
    }>
  ) => {
    try {
      const response = await authFetch<ApiResponse<any>>(
        `${apiUrl}/api/v1/participants/bulk-create`,
        {
          method: "POST",
          body: { participants },
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to bulk create participants",
        code: error.data?.code,
      };
    }
  };

  const searchParticipants = async (filters: {
    query?: string;
    metadata?: Record<string, any>;
    from?: string;
    to?: string;
    page?: number;
    perPage?: number;
  } = {}) => {
    try {
      const response = await authFetch<PaginatedResponseData<any>>(
        `${apiUrl}/api/v1/participants/search`,
        {
          method: "POST",
          body: filters,
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to search participants",
        code: error.data?.code,
      };
    }
  };

  return {
    getParticipants,
    getParticipantById,
    createParticipant,
    updateParticipant,
    deleteParticipant,
    exportParticipantsCsv,
    bulkImportParticipantsCsv,
    bulkCreateParticipantsJson,
    searchParticipants,
  };
};
