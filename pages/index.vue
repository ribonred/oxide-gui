<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-20">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium mb-6">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
        </span>
        v0.4.0 Beta+ Release
      </div>

      <img src="/logo.svg" alt="QuizOxide Logo" class="h-80 w-80 mx-auto" />

      <h1 class="text-5xl md:text-6xl font-bold text-gh-text mb-6 -mt-24 tracking-tight relative z-10">
        Quiz<span class="text-gradient-oxide">Oxide</span>
      </h1>

      <p class="text-xl md:text-2xl text-gh-text-secondary mb-3 max-w-3xl mx-auto leading-relaxed">
        The API-first quiz platform built with Rust.
      </p>
      <p class="text-base text-gh-text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
        Create quizzes on our dashboard or integrate the full engine into your product via REST API.
        Designed for educators, enterprises, and developers who need a quiz backend that scales.
      </p>

      <p class="text-xs text-gh-text-muted mb-8 max-w-xl mx-auto">
        Currently in alpha &mdash; data may be reset as we refine the architecture.
      </p>

      <div v-if="!isAuthenticated" class="flex flex-col sm:flex-row justify-center gap-4">
        <NuxtLink to="/register"
          class="inline-flex items-center justify-center bg-gh-accent hover:bg-gh-accent-hover text-white px-8 py-3 rounded-lg text-lg font-medium transition-all hover:scale-105">
          Start Creating
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
        <NuxtLink to="/public"
          class="inline-flex items-center justify-center bg-gh-bg-secondary hover:bg-gh-border text-gh-text px-8 py-3 rounded-lg text-lg font-medium border border-gh-border transition-all">
          Try a Quiz
        </NuxtLink>
      </div>
      <div v-else class="flex flex-col sm:flex-row justify-center gap-4">
        <NuxtLink to="/dashboard"
          class="inline-flex items-center justify-center bg-gh-accent hover:bg-gh-accent-hover text-white px-8 py-3 rounded-lg text-lg font-medium transition-all hover:scale-105">
          Go to Dashboard
        </NuxtLink>
        <NuxtLink to="/public"
          class="inline-flex items-center justify-center bg-gh-bg-secondary hover:bg-gh-border text-gh-text px-8 py-3 rounded-lg text-lg font-medium border border-gh-border transition-all">
          Browse Quizzes
        </NuxtLink>
      </div>
    </div>

    <!-- What Makes QuizOxide Different -->
    <div class="mb-24">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gh-text mb-4">Not just another quiz tool</h2>
        <p class="text-gh-text-secondary max-w-2xl mx-auto">
          Most quiz platforms are built for casual use. QuizOxide is built for organizations that need
          reliable assessment infrastructure &mdash; whether you use our dashboard or embed the engine into your own
          product.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- API-First -->
        <div
          class="bg-gh-bg-secondary p-8 rounded-2xl border border-gh-border hover:border-gh-accent/50 transition-colors group">
          <div
            class="w-12 h-12 bg-gh-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gh-text mb-3">API-First Architecture</h3>
          <p class="text-gh-text-secondary leading-relaxed">
            Every feature is exposed via REST API. Embed quiz creation, delivery, and scoring
            directly into your LMS, HR system, or educational portal. Issue API keys, manage participants
            programmatically, and let your platform handle the UX while QuizOxide handles the quiz engine.
          </p>
        </div>

        <!-- Performance -->
        <div
          class="bg-gh-bg-secondary p-8 rounded-2xl border border-gh-border hover:border-gh-accent/50 transition-colors group">
          <div
            class="w-12 h-12 bg-gh-info/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-gh-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gh-text mb-3">Built for Concurrency</h3>
          <p class="text-gh-text-secondary leading-relaxed">
            Written in Rust with Actix-Web, not a Node.js or Python monolith. When thousands of participants
            start an exam at the same moment, QuizOxide stays responsive. Load-tested to handle 10,000 concurrent
            users without performance degradation.
          </p>
        </div>

        <!-- Access Control -->
        <div
          class="bg-gh-bg-secondary p-8 rounded-2xl border border-gh-border hover:border-gh-accent/50 transition-colors group">
          <div
            class="w-12 h-12 bg-gh-success/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6 text-gh-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gh-text mb-3">Three-Tier Access Control</h3>
          <p class="text-gh-text-secondary leading-relaxed">
            Public quizzes for open participation. Shared quizzes with auto-generated access codes for classrooms.
            Private quizzes with credential-based authentication for certification exams and secure assessments.
            Choose the level that fits your use case.
          </p>
        </div>
      </div>
    </div>

    <!-- Feature Deep Dive -->
    <div class="border-t border-gh-border pt-20 mb-24">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gh-text mb-4">Everything you need to assess at scale</h2>
        <p class="text-gh-text-secondary max-w-2xl mx-auto">
          From question authoring to real-time monitoring, QuizOxide covers the full assessment lifecycle.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl mx-auto">
        <!-- 8 Question Types -->
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-gh-accent/10 rounded-lg flex items-center justify-center mt-1">
            <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gh-text mb-1">8 Question Types</h3>
            <p class="text-gh-text-secondary text-sm leading-relaxed">
              Multiple choice, multiple select, true/false, fill-in-the-blank, short answer, ordering,
              matching pairs, and essay. All auto-evaluated except essay, with AI grading on the roadmap.
            </p>
          </div>
        </div>

        <!-- Rich Content Editor -->
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-gh-accent/10 rounded-lg flex items-center justify-center mt-1">
            <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gh-text mb-1">Rich Content Editor</h3>
            <p class="text-gh-text-secondary text-sm leading-relaxed">
              Author questions with formatted text, LaTeX math equations, and structured content.
              The label/value system lets you update question wording without breaking answer keys.
            </p>
          </div>
        </div>

        <!-- Real-Time Monitoring -->
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-gh-accent/10 rounded-lg flex items-center justify-center mt-1">
            <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gh-text mb-1">Real-Time Monitoring</h3>
            <p class="text-gh-text-secondary text-sm leading-relaxed">
              Watch participants progress through a quiz in real time via WebSocket feeds.
              Live leaderboards update as answers are submitted. Auto-submission enforces deadlines.
            </p>
          </div>
        </div>

        <!-- Analytics -->
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-gh-accent/10 rounded-lg flex items-center justify-center mt-1">
            <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gh-text mb-1">Assessment Analytics</h3>
            <p class="text-gh-text-secondary text-sm leading-relaxed">
              Difficulty indexes, discrimination analysis, score distributions, and participant learning curves.
              Backed by TimescaleDB for time-series performance at scale.
            </p>
          </div>
        </div>

        <!-- Participant Management -->
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-gh-accent/10 rounded-lg flex items-center justify-center mt-1">
            <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gh-text mb-1">Participant Management</h3>
            <p class="text-gh-text-secondary text-sm leading-relaxed">
              Bulk import participants via CSV or API with custom metadata fields.
              Track attempts per participant, enforce max attempt limits, and map to external user IDs
              for integration with your existing systems.
            </p>
          </div>
        </div>

        <!-- Event System -->
        <div class="flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 bg-gh-accent/10 rounded-lg flex items-center justify-center mt-1">
            <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gh-text mb-1">Event Organization</h3>
            <p class="text-gh-text-secondary text-sm leading-relaxed">
              Group quizzes into time-bounded events with ticketing. Compare participation rates and
              score distributions across events. Ideal for exam periods, training sessions, and competitions.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Use Cases / Who It's For -->
    <div class="border-t border-gh-border pt-20 mb-24">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gh-text mb-4">Built for integration</h2>
        <p class="text-gh-text-secondary max-w-2xl mx-auto">
          Use QuizOxide standalone or plug it into your existing platform. The REST API gives you
          full control over every aspect of quiz delivery and evaluation.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-gh-bg-secondary p-6 rounded-xl border border-gh-border text-center">
          <div class="w-10 h-10 bg-gh-info/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-5 h-5 text-gh-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h4 class="text-sm font-semibold text-gh-text mb-2">Education</h4>
          <p class="text-gh-text-muted text-xs leading-relaxed">
            Campus-wide exams with shared access codes and real-time proctoring dashboards.
          </p>
        </div>

        <div class="bg-gh-bg-secondary p-6 rounded-xl border border-gh-border text-center">
          <div class="w-10 h-10 bg-gh-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h4 class="text-sm font-semibold text-gh-text mb-2">Enterprise</h4>
          <p class="text-gh-text-muted text-xs leading-relaxed">
            Employee onboarding, compliance training, and certification with private credential-based access.
          </p>
        </div>

        <div class="bg-gh-bg-secondary p-6 rounded-xl border border-gh-border text-center">
          <div class="w-10 h-10 bg-gh-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-5 h-5 text-gh-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h4 class="text-sm font-semibold text-gh-text mb-2">SaaS Platforms</h4>
          <p class="text-gh-text-muted text-xs leading-relaxed">
            Embed quiz functionality into your product via REST API. White-label the assessment engine.
          </p>
        </div>

        <div class="bg-gh-bg-secondary p-6 rounded-xl border border-gh-border text-center">
          <div class="w-10 h-10 bg-gh-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-5 h-5 text-gh-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 class="text-sm font-semibold text-gh-text mb-2">Government</h4>
          <p class="text-gh-text-muted text-xs leading-relaxed">
            Civil service exams and licensing tests with strict deadline enforcement and audit trails.
          </p>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="border-t border-gh-border pt-20 mb-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gh-text mb-4">Get started in minutes</h2>
        <p class="text-gh-text-secondary max-w-xl mx-auto">
          Whether you use the dashboard or the API, getting a quiz live takes three steps.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-gh-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span class="text-2xl font-bold text-gh-accent">1</span>
          </div>
          <h3 class="text-lg font-bold text-gh-text mb-2">Author Questions</h3>
          <p class="text-gh-text-secondary text-sm leading-relaxed">
            Create questions with the rich text editor or via the API. Choose from 8 question types.
            Build a reusable question bank organized by category and tags.
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-gh-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span class="text-2xl font-bold text-gh-accent">2</span>
          </div>
          <h3 class="text-lg font-bold text-gh-text mb-2">Configure & Distribute</h3>
          <p class="text-gh-text-secondary text-sm leading-relaxed">
            Set time limits, attempt caps, shuffling, and scheduling windows.
            Publish publicly, share with access codes, or restrict to pre-authorized participants with API keys.
          </p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-gh-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span class="text-2xl font-bold text-gh-accent">3</span>
          </div>
          <h3 class="text-lg font-bold text-gh-text mb-2">Monitor & Analyze</h3>
          <p class="text-gh-text-secondary text-sm leading-relaxed">
            Track progress via real-time WebSocket dashboards. Review analytics including difficulty indexes,
            score distributions, and participant performance trends after submission.
          </p>
        </div>
      </div>

      <div class="text-center mt-12">
        <NuxtLink to="/roadmap"
          class="inline-flex items-center gap-2 text-gh-text-muted hover:text-gh-accent text-sm transition-colors">
          View our product roadmap
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { isAuthenticated } = useAuth()
const config = useRuntimeConfig()

useHead({
  titleTemplate: ''
})

useSeoMeta({
  title: 'QuizOxide - API-First Quiz Platform Built with Rust',
  ogTitle: 'QuizOxide - API-First Quiz Platform Built with Rust',
  description: 'The API-first quiz platform for educators, enterprises, and developers. 8 question types, real-time monitoring, three-tier access control, and a full REST API for SaaS integration. Built with Rust for performance at scale.',
  ogDescription: 'Create, deliver, and analyze quizzes at scale. API-first architecture, 8 question types, real-time monitoring. Built with Rust.',
  ogUrl: config.public.siteUrl,
  ogImage: `${config.public.siteUrl}/og-logo.png`,
  twitterCard: 'summary_large_image',
  twitterImage: `${config.public.siteUrl}/og-logo.png`,
})

definePageMeta({
  layout: 'default'
})
</script>
