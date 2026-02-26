<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-grid">
        <!-- Brand -->
        <div class="footer-section">
          <NuxtLink to="/" class="footer-brand">
            <img :src="theme === 'dark' ? '/whitelogo.png' : '/blacklogo.png'" alt="QuizOxide" class="footer-logo-img" />
            <span class="footer-brand-text">QuizOxide</span>
          </NuxtLink>
          <p class="footer-tagline">The reliable quiz platform built with Rust.</p>
        </div>

        <!-- Product Links -->
        <div class="footer-section">
          <h4 class="footer-heading">Product</h4>
          <nav class="footer-nav">
            <NuxtLink to="/public" class="footer-link">Public Quizzes</NuxtLink>
            <NuxtLink to="/public/join" class="footer-link">Join Quiz</NuxtLink>
            <NuxtLink to="/roadmap" class="footer-link">Roadmap</NuxtLink>
          </nav>
        </div>

        <!-- Resources Links -->
        <div class="footer-section">
          <h4 class="footer-heading">Resources</h4>
          <nav class="footer-nav">
            <a :href="docsUrl" target="_blank" rel="noopener" class="footer-link">Documentation</a>
          </nav>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">&copy; {{ currentYear }} QuizOxide. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const config = useRuntimeConfig()
const docsUrl = config.public.docsUrl
const { theme } = useTheme()
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  border-top: 1px solid var(--color-gh-border);
  background: var(--color-gh-bg-secondary);
  margin-top: auto;
}

.footer-inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 767px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  margin-bottom: 0.75rem;
}

.footer-logo-img {
  width: 1.5rem;
  height: 1.5rem;
}

.footer-brand-text {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-gh-text);
}

.footer-tagline {
  font-size: 0.875rem;
  color: var(--color-gh-text-muted);
  line-height: 1.5;
}

.footer-heading {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gh-text);
  margin-bottom: 0.75rem;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  font-size: 0.875rem;
  color: var(--color-gh-text-muted);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--color-gh-accent);
}

.footer-bottom {
  border-top: 1px solid var(--color-gh-border);
  margin-top: 2rem;
  padding-top: 1.5rem;
  text-align: center;
}

.footer-copyright {
  font-size: 0.75rem;
  color: var(--color-gh-muted);
}
</style>
