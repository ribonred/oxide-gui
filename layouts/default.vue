<template>
  <div class="min-h-screen bg-gh-bg transition-colors duration-300 flex flex-col">
    <Sidebar />

    <!-- Main content with sidebar offset on desktop -->
    <main class="main-content flex-1" :class="{ 'sidebar-collapsed': !isSidebarVisible }">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8" :class="isSidebarVisible ? 'max-w-7xl' : 'max-w-full'">
        <slot />
      </div>
    </main>
    <footer class="footer-offset" :class="{ 'sidebar-collapsed': !isSidebarVisible }">
      <SiteFooter />
    </footer>
  </div>
</template>

<script setup>
import Sidebar from "~/components/Sidebar.vue";

const { isSidebarVisible } = useSidebar();

// Reconnect WebSocket on page refresh if already logged in
const { isAuthenticated } = useAuth();
const { connect, isConnected } = useWebSocket();

onMounted(() => {
  if (isAuthenticated.value && !isConnected.value) {
    connect();
  }
});
</script>

<style scoped>
.main-content {
  transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content>div {
  transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-offset {
  transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .main-content {
    padding-left: 16rem;
  }

  .main-content.sidebar-collapsed {
    padding-left: 0;
  }

  .footer-offset {
    padding-left: 16rem;
  }

  .footer-offset.sidebar-collapsed {
    padding-left: 0;
  }
}

.nav-link {
  @apply text-gh-text-secondary hover:text-gh-text px-3 py-2 rounded-md text-sm font-medium transition-colors;
}

.nav-link.router-link-active {
  @apply text-gh-text bg-gh-bg;
}

.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-gh-text-secondary hover:text-gh-text hover:bg-gh-bg transition-colors;
}

.mobile-nav-link.router-link-active {
  @apply text-gh-text bg-gh-bg;
}

.btn-primary {
  @apply bg-gh-accent hover:bg-gh-accent-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm;
}
</style>
