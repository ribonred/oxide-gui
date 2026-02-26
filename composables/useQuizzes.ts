import type {
  ApiResponse,
  PaginatedResponseData,
  ResponseListData,
  Quiz,
  CreateQuizRequest,
  UpdateQuizRequest,
  PatchQuizMetadataOpsRequest,
  PatchQuizTagsOpsRequest
} from "~/types/api";

export interface Participant {
  alias: string;
  id: string;
  attempt_id: string;
}

export const useQuizzes = () => {
  const config = useRuntimeConfig();
  const { authFetch } = useAuth();

  const apiUrl = config.public.apiUrl || "http://localhost:8080";

  const getQuizzes = async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    access_type?: string;
    availability?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page)
        queryParams.append("per_page", params.per_page.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.access_type)
        queryParams.append("access_type", params.access_type);
      if (params?.availability)
        queryParams.append("availability", params.availability);

      const url = `${apiUrl}/api/v1/quizzes${
        queryParams.toString() ? `?${queryParams}` : ""
      }`;

      const response = await authFetch<PaginatedResponseData<Quiz>>(url, {
        method: "GET",
      });
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to fetch quizzes",
        code: error.data?.code,
      };
    }
  };

  const getQuizById = async (id: string) => {
    try {
      const response = await authFetch<ApiResponse<Quiz>>(
        `${apiUrl}/api/v1/quizzes/${id}`,
        {
          method: "GET",
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to fetch quiz",
        code: error.data?.code,
      };
    }
  };

  const createQuiz = async (quizData: CreateQuizRequest) => {
    try {
      const response = await authFetch<ApiResponse<Quiz>>(
        `${apiUrl}/api/v1/quizzes`,
        {
          method: "POST",
          body: quizData,
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to create quiz",
        code: error.data?.code,
      };
    }
  };

  const updateQuiz = async (id: string, quizData: UpdateQuizRequest) => {
    try {
      const response = await authFetch<ApiResponse<Quiz>>(
        `${apiUrl}/api/v1/quizzes/${id}`,
        {
          method: "PUT",
          body: quizData,
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to update quiz",
        code: error.data?.code,
      };
    }
  };

  const updateQuizMetadata = async (id: string, ops: PatchQuizMetadataOpsRequest) => {
    try {
      const response = await authFetch<ApiResponse<Quiz>>(
        `${apiUrl}/api/v1/quizzes/${id}/metadata/ops`,
        {
          method: "PATCH",
          body: ops,
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to update quiz metadata",
        code: error.data?.code,
      };
    }
  };

  const updateQuizTags = async (id: string, ops: PatchQuizTagsOpsRequest) => {
    try {
      const response = await authFetch<ApiResponse<Quiz>>(
        `${apiUrl}/api/v1/quizzes/${id}/tags/ops`,
        {
          method: "PATCH",
          body: ops,
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to update quiz tags",
        code: error.data?.code,
      };
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      const response = await authFetch<ApiResponse<any>>(
        `${apiUrl}/api/v1/quizzes/${id}`,
        {
          method: "DELETE",
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to delete quiz",
        code: error.data?.code,
      };
    }
  };

  const bindQuestions = async (
    id: string,
    add: string[],
    remove: string[] = []
  ) => {
    try {
      const response = await authFetch<ApiResponse<any>>(
        `${apiUrl}/api/v1/quizzes/bind-questions`,
        {
          method: "POST",
          body: {
            quiz_id: parseInt(id),
            add,
            remove,
          },
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to bind questions",
        code: error.data?.code,
      };
    }
  };

  const getPublicQuizzes = async (params?: {
    page?: number;
    per_page?: number;
  }) => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page)
        queryParams.append("per_page", params.per_page.toString());

      const url = `${apiUrl}/api/v1/quizzes/public${
        queryParams.toString() ? `?${queryParams}` : ""
      }`;

      const response = await $fetch<PaginatedResponseData<any>>(url, {
        method: "GET",
      });
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to fetch public quizzes",
        code: error.data?.code,
      };
    }
  };

  const queryPublicQuizzes = async (params: {
    page?: number;
    perPage?: number;
    filters?: {
      categories?: string[];
      tags?: string[];
    };
  }) => {
    try {
      const body: Record<string, any> = {};

      if (params.page) body.page = params.page;
      if (params.perPage) body.perPage = params.perPage;

      if (params.filters) {
        body.filters = {};
        if (params.filters.categories && params.filters.categories.length > 0) {
          body.filters.categories = params.filters.categories;
        }
        if (params.filters.tags && params.filters.tags.length > 0) {
          body.filters.tags = params.filters.tags;
        }
      }

      const response = await $fetch<PaginatedResponseData<any>>(
        `${apiUrl}/api/v1/quizzes/public/query`,
        {
          method: "POST",
          body,
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to query public quizzes",
        code: error.data?.code,
      };
    }
  };

  const getPublicQuizById = async (id: string) => {
    try {
      const response = await $fetch<ApiResponse<any>>(
        `${apiUrl}/api/v1/quizzes/${id}/public`,
        {
          method: "GET",
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to fetch public quiz",
        code: error.data?.code,
      };
    }
  };

  const getSharedQuizDetail = async (accessCode: string) => {
    try {
      const response = await $fetch<ApiResponse<any>>(
        `${apiUrl}/api/v1/quizzes/shared/${accessCode}`,
        {
          method: "GET",
        }
      );
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to fetch shared quiz",
        code: error.data?.code,
      };
    }
  };

  const getQuizLeaderboard = async (
    id: string,
    params?: {
      rank?: string;
    }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.rank) queryParams.append("rank", params.rank);

      const url = `${apiUrl}/api/v1/info/quizezz/leaderboard/${id}${
        queryParams.toString() ? `?${queryParams}` : ""
      }`;

      const response = await authFetch<ResponseListData<any>>(url, {
        method: "GET",
      });
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to fetch leaderboard",
        code: error.data?.code,
      };
    }
  };

  const getPublicQuizLeaderboard = async (id: string, params?: {
    rank?: string
  }) => {
    try {
      const queryParams = new URLSearchParams()
      if (params?.rank) queryParams.append('rank', params.rank)

      const url = `${apiUrl}/api/v1/info/quizezz/leaderboard/${id}/public${queryParams.toString() ? `?${queryParams}` : ''}`

      const response = await $fetch<ResponseListData<any>>(url, {
        method: 'GET',
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to fetch public leaderboard',
        code: error.data?.code
      }
    }
  }

  const getQuizParticipants = async (id: string) => {
    try {
      const url = `${apiUrl}/api/v1/info/quizezz/participant/${id}`;

      const response = await authFetch<ResponseListData<any>>(url, {
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

  const queryQuizzes = async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    access_type?: string;
    availability?: string;
    query?: string;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
      if (params?.status) queryParams.append("status", params.status);
      if (params?.access_type) queryParams.append("access_type", params.access_type);
      if (params?.availability) queryParams.append("availability", params.availability);

      const url = `${apiUrl}/api/v1/quizzes/query${queryParams.toString() ? `?${queryParams}` : ""}`;

      const body: Record<string, any> = {};
      if (params?.query) body.query = params.query;

      const response = await authFetch<PaginatedResponseData<Quiz>>(url, {
        method: "POST",
        body,
      });
      return { success: true, data: response };
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || "Failed to query quizzes",
        code: error.data?.code,
      };
    }
  };

  return {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    updateQuizMetadata,
    updateQuizTags,
    deleteQuiz,
    bindQuestions,
    getPublicQuizzes,
    queryPublicQuizzes,
    queryQuizzes,
    getPublicQuizById,
    getSharedQuizDetail,
    getQuizLeaderboard,
    getPublicQuizLeaderboard,
    getQuizParticipants,
  };
};
