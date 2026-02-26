export const useEventEnums = () => {
  const eventStatuses = [
    { value: 'all', label: 'All' },
    { value: 'available', label: 'Available' },
  ]

  const ticketTypes = [
    { value: 'quiz', label: 'Quiz' },
    { value: 'event', label: 'Event' },
  ]

  const getEventStatusLabel = (isActive, startsAt, endsAt) => {
    const now = new Date()
    const start = new Date(startsAt)
    const end = new Date(endsAt)

    if (now < start) return 'Upcoming'
    if (now > end) return 'Expired'
    if (isActive) return 'Active'
    return 'Inactive'
  }

  const getEventStatusClass = (isActive, startsAt, endsAt) => {
    const now = new Date()
    const start = new Date(startsAt)
    const end = new Date(endsAt)

    if (now < start) return 'badge-warning'
    if (now > end) return 'badge-neutral'
    if (isActive) return 'badge-success'
    return 'badge-danger'
  }

  const getTicketStatusClass = (ticket) => {
    if (ticket.revoked_at) return 'badge-danger'
    if (ticket.remaining <= 0) return 'badge-neutral'
    if (new Date(ticket.expires_at) < new Date()) return 'badge-neutral'
    return 'badge-success'
  }

  const getTicketStatusLabel = (ticket) => {
    if (ticket.revoked_at) return 'Revoked'
    if (new Date(ticket.expires_at) < new Date()) return 'Expired'
    if (ticket.remaining <= 0) return 'Used'
    return 'Active'
  }

  return {
    eventStatuses,
    ticketTypes,
    getEventStatusLabel,
    getEventStatusClass,
    getTicketStatusClass,
    getTicketStatusLabel,
  }
}
