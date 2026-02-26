<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gh-text mb-4">Product Roadmap</h1>
      <p class="text-xl text-gh-text-secondary max-w-2xl mx-auto">
        Our journey to building the ultimate quiz platform
      </p>
    </div>

    <div class="relative max-w-3xl mx-auto">
      <!-- Vertical Connecting Line -->
      <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gh-border -z-10"></div>

      <div v-for="phase in roadmapData" :key="phase.id" class="relative flex gap-8 mb-12 last:mb-0">
        <!-- Number Circle -->
        <div class="flex-shrink-0">
          <div
            class="w-16 h-16 bg-gh-bg border-4 rounded-full flex items-center justify-center z-10"
            :class="phase.badgeColor === 'green' ? 'border-gh-accent' : 'border-gh-border'">
            <span class="text-xl font-bold"
              :class="phase.badgeColor === 'green' ? 'text-gh-text' : 'text-gh-text-muted'">{{ phase.id }}</span>
          </div>
        </div>

        <!-- Content Card -->
        <div class="flex-grow bg-gh-bg-secondary p-6 rounded-xl border border-gh-border" :class="phase.opacity">
          <div class="inline-block px-2 py-1 rounded text-xs font-medium mb-3"
            :class="{
              'badge-success': phase.badgeColor === 'green',
              'badge-info': phase.badgeColor === 'blue',
              'badge-danger': phase.badgeColor === 'purple',
              'badge-warning': phase.badgeColor === 'yellow'
            }">
            {{ phase.badge }}
          </div>
          <h3 class="text-lg font-bold text-gh-text mb-4">{{ phase.title }}</h3>
          <ul class="space-y-3 text-gh-text-secondary text-sm">
            <li v-for="(item, idx) in phase.items" :key="idx" class="flex items-center gap-2">
              <!-- Completed Icon -->
              <svg v-if="item.status === 'completed'" class="w-4 h-4 text-gh-success" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <!-- In Progress Icon -->
              <div v-else-if="item.status === 'in-progress'"
                class="w-4 h-4 rounded-full border border-gh-muted flex items-center justify-center">
                <div class="w-2 h-2 bg-gh-info rounded-full animate-pulse"></div>
              </div>
              <!-- Pending Icon -->
              <div v-else class="w-4 h-4 rounded-full border border-gh-muted"></div>

              {{ item.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { roadmapData } from '~/config/roadmap'

useSeoMeta({
  title: 'Roadmap',
  ogTitle: 'QuizOxide Roadmap',
  description: 'See what we are building next. From AI-powered question generation to real-time competitions, explore the QuizOxide product roadmap.',
  ogDescription: 'See what we are building next on QuizOxide.',
})

definePageMeta({
  layout: 'default'
})
</script>
