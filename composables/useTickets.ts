import type {
  ApiResponse,
  ResponseListData,
} from '~/types/api'
import type {
  Ticket,
  CreateTicketRequest,
  ListTicketsQuery,
} from '~/types/event'

export const useTickets = () => {
  const config = useRuntimeConfig()
  const { authFetch } = useAuth()

  const apiUrl = config.public.apiUrl || 'http://localhost:8080'

  const createTicket = async (data: CreateTicketRequest) => {
    try {
      const response = await authFetch<ApiResponse<Ticket>>(
        `${apiUrl}/api/v1/tickets`,
        {
          method: 'POST',
          body: data,
        }
      )
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to create ticket',
        code: error.data?.code,
      }
    }
  }

  const listTickets = async (query: ListTicketsQuery = {}) => {
    try {
      const params = new URLSearchParams()
      if (query.participant_id) params.append('participant_id', query.participant_id)
      if (query.ticket_type) params.append('ticket_type', query.ticket_type)

      const url = `${apiUrl}/api/v1/tickets${params.toString() ? `?${params}` : ''}`
      const response = await authFetch<ResponseListData<Ticket>>(url, {
        method: 'GET',
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to list tickets',
        code: error.data?.code,
      }
    }
  }

  const revokeTicket = async (ticketId: string) => {
    try {
      const response = await authFetch<ApiResponse<Ticket>>(
        `${apiUrl}/api/v1/tickets/${ticketId}`,
        { method: 'DELETE' }
      )
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to revoke ticket',
        code: error.data?.code,
      }
    }
  }

  return {
    createTicket,
    listTickets,
    revokeTicket,
  }
}
