<template>
  <div class="min-h-screen bg-gh-bg transition-colors duration-300 flex flex-col">
    <div v-if="!hideChrome" class="hidden 2xl:block">
      <Sidebar />
    </div>
    
    <!-- Full width main content with sidebar offset on desktop -->
    <main class="flex-1 flex flex-col min-h-screen" :class="{ '2xl:pl-64': !hideChrome }">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue'

const route = useRoute()

const hideChrome = computed(() => {
  const value = route.query.oxideClient
  if (Array.isArray(value)) return value[0] === 'true'
  return value === 'true'
})
</script>
