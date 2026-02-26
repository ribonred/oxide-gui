<template>
  <div class="min-h-screen bg-gh-bg transition-colors duration-300">
    <Sidebar />

    <!-- Full width main content with sidebar offset on desktop -->
    <main class="main-content" :class="{ 'sidebar-collapsed': !isSidebarVisible }">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Sidebar from "~/components/Sidebar.vue";

const { isSidebarVisible } = useSidebar();
</script>

<style scoped>
.main-content {
  transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  width: 100%;
}

.main-content > * {
  transition: max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .main-content {
    padding-left: 16rem;
  }
  
  .main-content.sidebar-collapsed {
    padding-left: 0;
  }
}
</style>
