export const useTheme = () => {
  const theme = useState<string>('theme', () => 'dark')
  const listenersInstalled = useState<boolean>('theme_listeners_installed', () => false)

  const normalizeTheme = (value: unknown): string | null => {
    const t = String(value || '').toLowerCase()
    if (t === 'dark' || t === 'light') return t
    return null
  }

  const applyTheme = (newTheme: string) => {
    theme.value = newTheme
    if (import.meta.client) {
      localStorage.setItem('theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  const installListeners = () => {
    if (!import.meta.client || listenersInstalled.value) return
    listenersInstalled.value = true

    ;(window as any).__oxideSetTheme = (next: string) => {
      const t = normalizeTheme(next)
      if (t) applyTheme(t)
    }

    window.addEventListener('oxide:set-theme', (event: Event) => {
      const detail = (event as CustomEvent).detail
      const t = normalizeTheme(detail?.theme)
      if (t) applyTheme(t)
    })

    // Multi-tab syncing (won't fire in same tab that sets localStorage)
    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key !== 'theme') return
      const t = normalizeTheme(event.newValue)
      if (t) applyTheme(t)
    })
  }

  const setTheme = (newTheme: string) => {
    const t = normalizeTheme(newTheme)
    if (!t) return
    applyTheme(t)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  const initTheme = () => {
    if (import.meta.client) {
      installListeners()

      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(prefersDark ? 'dark' : 'light')
      }
    }
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    initTheme
  }
}
