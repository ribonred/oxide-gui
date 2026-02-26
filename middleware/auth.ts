export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, refreshAccessToken } = useAuth()
  const refreshToken = useCookie('refresh_token')
  
  // If not authenticated but has refresh token, try to refresh
  if (!isAuthenticated.value && refreshToken.value) {
    const refreshed = await refreshAccessToken()
    
    // If refresh succeeded, allow navigation
    if (refreshed) {
      return
    }
  }
  
  // If still not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
