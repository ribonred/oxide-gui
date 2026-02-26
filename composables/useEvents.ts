import type {
  ApiResponse,
  PaginatedResponseData,
} from '~/types/api'
import type {
  EventDetail,
  EventListItem,
  CreateEventRequest,
  UpdateEventRequest,
  SearchEventsRequest,
} from '~/types/event'

export const useEvents = () => {
  const config = useRuntimeConfig()
  const { authFetch } = useAuth()

  const apiUrl = config.public.apiUrl || 'http://localhost:8080'

  const searchEvents = async (filters: SearchEventsRequest = {}) => {
    try {
      const response = await authFetch<PaginatedResponseData<EventListItem>>(
        `${apiUrl}/api/v1/events/search`,
        {
          method: 'POST',
          body: filters,
        }
      )
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to search events',
        code: error.data?.code,
      }
    }
  }

  const getEventById = async (id: string) => {
    try {
      const response = await authFetch<ApiResponse<EventDetail>>(
        `${apiUrl}/api/v1/events/${id}`,
        { method: 'GET' }
      )
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to fetch event',
        code: error.data?.code,
      }
    }
  }

  const createEvent = async (data: CreateEventRequest) => {
    try {
      const response = await authFetch<ApiResponse<EventDetail>>(
        `${apiUrl}/api/v1/events`,
        {
          method: 'POST',
          body: data,
        }
      )
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to create event',
        code: error.data?.code,
      }
    }
  }

  const updateEvent = async (id: string, data: UpdateEventRequest) => {
    try {
      const response = await authFetch<ApiResponse<EventDetail>>(
        `${apiUrl}/api/v1/events/${id}`,
        {
          method: 'PUT',
          body: data,
        }
      )
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to update event',
        code: error.data?.code,
      }
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      await authFetch(`${apiUrl}/api/v1/events/${id}`, {
        method: 'DELETE',
      })
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to delete event',
        code: error.data?.code,
      }
    }
  }

  return {
    searchEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
  }
}
