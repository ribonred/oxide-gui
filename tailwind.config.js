/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  safelist: [
    'bg-gradient-to-r',
    'from-orange-500',
    'to-red-600',
    'bg-clip-text',
    'text-transparent',
  ],
  theme: {
    extend: {
      colors: {
        'gh-bg': 'var(--color-gh-bg)',
        'gh-bg-secondary': 'var(--color-gh-bg-secondary)',
        'gh-border': 'var(--color-gh-border)',
        'gh-text': 'var(--color-gh-text)',
        'gh-text-secondary': 'var(--color-gh-text-muted)',
        'gh-muted': 'var(--color-gh-muted)',
        'gh-accent': 'var(--color-gh-accent)',
        'gh-accent-hover': 'var(--color-gh-accent-hover)',
        'gh-success': 'var(--color-gh-success)',
        'gh-danger': 'var(--color-gh-danger)',
        'gh-warning': 'var(--color-gh-warning)',
        'gh-info': 'var(--color-gh-info)',
        'gh-card': 'var(--color-gh-card)',
        'gh-card-hover': 'var(--color-gh-card-hover)',
        'gh-hover': 'var(--color-gh-card-hover)',
        'gh-card-selected': 'var(--color-gh-card-selected)',
        'gh-card-selected-end': 'var(--color-gh-card-selected-end)',
        'gh-pair-bg': 'var(--color-gh-pair-bg)',
        'gh-pair-bg-mid': 'var(--color-gh-pair-bg-mid)',
        'gh-pair-border': 'var(--color-gh-pair-border)',
        'gh-arrow-accent': 'var(--color-gh-arrow-accent)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
