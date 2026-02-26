export const useQuestionInfo = () => {
  const config = useRuntimeConfig()
  const { authFetch } = useAuth()

  const apiUrl = config.public.apiUrl || 'http://localhost:8080'

  // Global state for question info (shared across components)
  const questionInfo = useState('questionInfo', () => ({
    total: 0,
    categories: [],
    easy: 0,
    medium: 0,
    hard: 0
  }))

  const loading = useState('questionInfoLoading', () => false)

  const getQuestionInfo = async () => {
    loading.value = true
    
    try {
      const response = await authFetch(`${apiUrl}/api/v1/info/questions`, {
        method: 'GET',
      })

      if (response.data) {
        questionInfo.value = response.data
        return { success: true, data: response.data }
      }

      return { success: false, error: response.msg || 'Failed to fetch question info' }
    } catch (error) {
      console.error('Error fetching question info:', error)
      return { success: false, error: error.data?.message || error.message || 'An error occurred' }
    } finally {
      loading.value = false
    }
  }

  const refreshQuestionInfo = async () => {
    // Force refresh by always calling the API
    return await getQuestionInfo()
  }

  return {
    questionInfo: readonly(questionInfo),
    loading: readonly(loading),
    getQuestionInfo,
    refreshQuestionInfo
  }
}
