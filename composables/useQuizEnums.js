export const useQuizEnums = () => {
  const quizStatuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ]

  const accessTypes = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'shared', label: 'Shared' }
  ]

  const availabilities = [
    { value: 'always', label: 'Always' },
    { value: 'scheduled', label: 'Scheduled' }
  ]

  const submissionModes = [
    { value: 'soft_limit', label: 'Soft Limit (Flexible)' },
    { value: 'hard_limit', label: 'Hard Limit (Strict)' }
  ]

  const getStatusClass = (status) => {
    const classes = {
      Draft: 'badge-neutral',
      Published: 'badge-success',
      Archived: 'badge-warning'
    }
    return classes[status] || 'badge-neutral'
  }

  const getAccessTypeClass = (accessType) => {
    const classes = {
      Public: 'badge-info',
      Private: 'badge-danger',
      Shared: 'badge-warning'
    }
    return classes[accessType] || 'badge-neutral'
  }

  return {
    quizStatuses,
    accessTypes,
    availabilities,
    submissionModes,
    getStatusClass,
    getAccessTypeClass
  }
}
