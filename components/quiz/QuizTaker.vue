<template>
    <div class="w-full relative">
        <!-- Global Alert Popup -->
        <div v-if="alertVisible" class="fixed z-[100] animate-fade-in-down
                    top-2 left-2 right-2 
                    md:top-auto md:bottom-6 md:right-6 md:left-auto md:w-auto md:max-w-sm">
            <div class="relative">
                <Alert :variant="alertType" class="shadow-2xl border !p-3 !rounded-2xl backdrop-blur-xl !bg-opacity-20">
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex-1 min-w-0">
                            <h3 v-if="alertTitle" class="font-bold text-sm mb-0.5">{{ alertTitle }}</h3>
                            <p class="text-xs opacity-90 leading-tight">{{ alertMessage }}</p>
                        </div>
                        <button @click="closeAlert"
                            class="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors flex-shrink-0 opacity-70 hover:opacity-100">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </Alert>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20 max-w-4xl mx-auto px-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20 max-w-4xl mx-auto px-4">
            <Alert variant="error">
                {{ error }}
            </Alert>
            <Button class="mt-4" @click="router.push(backPath)">
                {{ backTitle }}
            </Button>
        </div>

        <!-- Quiz Start Screen -->
        <div v-else-if="!attemptStarted && quiz" class="relative max-w-4xl mx-auto px-4 py-8">
            <!-- Decorative background elements -->
            <!-- <div class="absolute -top-20 -right-20 w-72 h-72 bg-gh-accent opacity-10 rounded-full blur-3xl -z-10"></div> -->
            <!-- <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl -z-10"></div> -->

            <div class="mb-6">
                <BackButton :to="backPath" :title="backTitle" />
            </div>

            <Card class="overflow-hidden border-2 border-gh-border/50 shadow-2xl">
                <!-- Hero Header -->
                <div class="bg-gradient-to-br from-gh-accent/10 to-blue-500/10 p-4 md:p-8 border-b border-gh-border/50">
                    <div class="flex items-start gap-4">
                        <div class="p-3 md:p-4 bg-gh-accent/10 rounded-2xl border border-gh-accent/20">
                            <svg class="w-8 h-8 md:w-12 md:h-12 text-gh-accent" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div class="flex-1">
                            <div
                                class="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-3 mb-2 md:mb-3">
                                <h1
                                    class="text-2xl md:text-4xl font-bold text-gh-text bg-gradient-to-r from-gh-text to-gh-accent bg-clip-text break-words">
                                    {{ quiz.title }}</h1>
                                <NuxtLink v-if="leaderboardPath" :to="leaderboardPath"
                                    class="self-start md:self-auto md:flex-shrink-0">
                                    <Button variant="secondary" size="sm">View Leaderboard</Button>
                                </NuxtLink>
                            </div>
                            <p v-if="quiz.description"
                                class="text-sm md:text-lg text-gh-text-muted leading-relaxed whitespace-pre-wrap">{{
                                    quiz.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- Content Section -->
                <div class="p-8">
                    <!-- Quiz Info Cards -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <!-- Questions Card -->
                        <div
                            class="p-4 md:p-5 bg-gradient-to-br from-gh-card to-gh-bg rounded-xl border border-gh-border/50 shadow-md hover:shadow-lg transition-shadow">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="p-2 bg-gh-accent/10 rounded-lg">
                                    <svg class="w-5 h-5 md:w-6 md:h-6 text-gh-accent" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gh-muted font-medium">Questions</p>
                                    <p class="text-xl md:text-2xl font-bold text-gh-text">{{ quiz.question_count }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Time Limit Card -->
                        <div
                            class="p-4 md:p-5 bg-gradient-to-br from-gh-card to-gh-bg rounded-xl border border-gh-border/50 shadow-md hover:shadow-lg transition-shadow">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="p-2 bg-blue-500/10 rounded-lg">
                                    <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gh-muted font-medium">Time</p>
                                    <p class="text-lg md:text-xl font-bold text-gh-text">{{
                                        formatTimeLimit(quiz.time_limit_seconds) }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Max Attempts Card -->
                        <div
                            class="p-4 md:p-5 bg-gradient-to-br from-gh-card to-gh-bg rounded-xl border border-gh-border/50 shadow-md hover:shadow-lg transition-shadow">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="p-2 bg-purple-500/10 rounded-lg">
                                    <svg class="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gh-muted font-medium">Attempts</p>
                                    <p class="text-xl md:text-2xl font-bold text-gh-text">{{ quiz.max_attempts }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Shuffle Card -->
                        <div
                            class="p-4 md:p-5 bg-gradient-to-br from-gh-card to-gh-bg rounded-xl border border-gh-border/50 shadow-md hover:shadow-lg transition-shadow">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="p-2 bg-green-500/10 rounded-lg">
                                    <svg class="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="text-xs text-gh-muted font-medium">Shuffle</p>
                                    <p class="text-xl md:text-2xl font-bold text-gh-text">{{ quiz.shuffle_questions ?
                                        'Yes' : 'No'
                                    }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Participant Name Input -->
                    <div v-if="!memberMode" class="mb-6">
                        <div class="p-5 bg-gradient-to-br from-gh-card to-gh-bg rounded-xl border border-gh-border/50">
                            <div class="flex items-center gap-2 mb-3">
                                <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <p class="text-sm font-semibold text-gh-text">Participant Information</p>
                            </div>

                            <!-- Participant Type Selection -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                <OptionCard :selected="authMode === 'alias'" @click="authMode = 'alias'">
                                    <div class="font-semibold">New Participant</div>
                                    <div class="text-xs text-gh-text-muted mt-1">Create a new profile</div>
                                </OptionCard>
                                <OptionCard :selected="authMode === 'id'" @click="authMode = 'id'">
                                    <div class="font-semibold">Existing ID</div>
                                    <div class="text-xs text-gh-text-muted mt-1">I have a participant ID</div>
                                </OptionCard>
                            </div>

                            <div v-if="authMode === 'alias'">
                                <Input v-model="participantAlias" label="Your Name/Alias"
                                    placeholder="Enter your name or nickname" :error="aliasError" />
                            </div>

                            <div v-else>
                                <Input v-model="participantId" label="Participant ID"
                                    placeholder="Enter your participant ID (participant:xxx)"
                                    :error="participantIdError" />
                                <p class="text-xs text-gh-text-muted mt-1">Use your existing participant ID to link this
                                    attempt to your history.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Event Selection (Member Mode) -->
                    <div v-if="memberMode" class="mb-6">
                        <div class="p-5 bg-gradient-to-br from-gh-card to-gh-bg rounded-xl border border-gh-border/50">
                            <div class="flex items-center gap-2 mb-3">
                                <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p class="text-sm font-semibold text-gh-text">Event Selection</p>
                            </div>

                            <!-- Loading Events -->
                            <div v-if="loadingEvents" class="flex items-center justify-center py-6">
                                <div class="animate-spin rounded-full h-6 w-6 border-2 border-gh-accent border-t-transparent"></div>
                                <span class="ml-3 text-sm text-gh-text-muted">Loading events...</span>
                            </div>

                            <!-- No Events -->
                            <div v-else-if="events.length === 0" class="py-4 text-center">
                                <svg class="w-10 h-10 mx-auto mb-2 text-gh-text-muted opacity-50" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p class="text-sm text-gh-text-muted">No events available</p>
                                <p class="text-xs text-gh-text-muted mt-1 opacity-70">You can still take the quiz without an event.</p>
                            </div>

                            <!-- Event Searchable Select -->
                            <div v-else class="relative" ref="eventDropdownRef">
                                <!-- Selected Event Display / Search Input -->
                                <div class="relative">
                                    <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg class="w-4 h-4 text-gh-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        v-model="eventSearchQuery"
                                        @focus="showEventDropdown = true"
                                        @input="showEventDropdown = true"
                                        type="text"
                                        :placeholder="selectedEvent ? selectedEvent.name : 'Search events...'"
                                        class="w-full pl-10 pr-10 py-3 bg-gh-bg border border-gh-border rounded-lg text-sm text-gh-text placeholder:text-gh-text-muted focus:outline-none focus:ring-2 focus:ring-gh-accent/50 focus:border-gh-accent transition-all"
                                        :class="selectedEvent && !eventSearchQuery ? 'border-gh-accent/40' : ''"
                                    />
                                    <!-- Clear / Chevron button -->
                                    <button v-if="selectedEvent"
                                        @click.stop="clearSelectedEvent"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gh-bg-secondary rounded-full transition-colors"
                                        title="Clear selection">
                                        <svg class="w-4 h-4 text-gh-text-muted hover:text-gh-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <button v-else
                                        @click.stop="showEventDropdown = !showEventDropdown"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 p-1">
                                        <svg class="w-4 h-4 text-gh-text-muted transition-transform" :class="showEventDropdown ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                <!-- Selected Event Badge -->
                                <div v-if="selectedEvent && !showEventDropdown" class="mt-2 flex items-center gap-2 p-3 bg-gh-accent/5 border border-gh-accent/20 rounded-lg">
                                    <div class="p-1.5 bg-gh-accent/10 rounded-lg flex-shrink-0">
                                        <svg class="w-4 h-4 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div ref="eventNameContainerRef" class="overflow-hidden">
                                            <p ref="eventNameTextRef" class="text-sm font-medium text-gh-text whitespace-nowrap" :class="{ 'event-badge-marquee': eventNameOverflows }">{{ selectedEvent.name }}</p>
                                        </div>
                                        <p class="text-xs text-gh-text-muted truncate">
                                            {{ formatEventDate(selectedEvent.starts_at) }} — {{ formatEventDate(selectedEvent.ends_at) }}
                                        </p>
                                    </div>
                                    <svg class="w-4 h-4 text-gh-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>

                                <!-- Dropdown List -->
                                <div v-if="showEventDropdown"
                                    class="absolute z-30 mt-1 w-full bg-gh-card border border-gh-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    <div v-if="filteredEvents.length === 0" class="p-4 text-center text-sm text-gh-text-muted">
                                        No events match your search
                                    </div>
                                    <button
                                        v-for="event in filteredEvents"
                                        :key="event.id"
                                        @click="selectEvent(event)"
                                        class="w-full text-left px-4 py-3 hover:bg-gh-bg-secondary/50 transition-colors border-b border-gh-border/30 last:border-b-0 flex items-center gap-3"
                                        :class="selectedEventId === event.id ? 'bg-gh-accent/5' : ''"
                                    >
                                        <div class="p-1.5 rounded-lg flex-shrink-0"
                                            :class="selectedEventId === event.id ? 'bg-gh-accent/10' : 'bg-gh-bg-secondary'">
                                            <svg class="w-4 h-4" :class="selectedEventId === event.id ? 'text-gh-accent' : 'text-gh-text-muted'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium truncate"
                                                :class="selectedEventId === event.id ? 'text-gh-accent' : 'text-gh-text'">{{ event.name }}</p>
                                            <p class="text-xs text-gh-text-muted truncate">
                                                {{ formatEventDate(event.starts_at) }} — {{ formatEventDate(event.ends_at) }}
                                            </p>
                                        </div>
                                        <svg v-if="selectedEventId === event.id" class="w-4 h-4 text-gh-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Resume Session Option -->
                    <div class="mb-6 p-5 bg-gradient-to-br from-gh-card to-gh-bg rounded-xl border border-gh-border/50">
                        <div class="flex items-center gap-2 mb-3">
                            <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p class="text-sm font-semibold text-gh-text">Continue Previous Session</p>
                        </div>
                        <p class="text-sm text-gh-text-muted mb-3">Have a session token? Resume where you left off:</p>
                        <div class="flex flex-col sm:flex-row gap-3 sm:items-end">
                            <Input v-model="resumeSessionToken" label="Session Token"
                                placeholder="Enter session token (ses_...)" class="w-full flex-1" />
                            <Button variant="secondary" @click="resumeSession"
                                :disabled="!resumeSessionToken || resuming"
                                class="w-full sm:w-auto !px-6 hover:scale-105 transition-transform">
                                <span v-if="!resuming" class="flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {{ resuming ? 'Resuming...' : 'Resume' }}
                                </span>
                                <span v-else class="flex items-center justify-center gap-2">
                                    <div
                                        class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent">
                                    </div>
                                    Resuming...
                                </span>
                            </Button>
                        </div>
                    </div>

                    <!-- Start Button -->
                    <Button @click="memberMode ? showConfirmModal = true : startQuiz()" :disabled="starting"
                        class="w-full !py-4 !text-lg font-semibold bg-gradient-to-r from-gh-accent to-blue-500 hover:from-gh-accent/90 hover:to-blue-600 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                        <span v-if="!starting" class="flex items-center justify-center gap-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Start Quiz
                        </span>
                        <span v-else class="flex items-center justify-center gap-2">
                            <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent">
                            </div>
                            Starting...
                        </span>
                    </Button>
                </div>
            </Card>
        </div>

        <!-- Quiz Taking Screen -->
        <div v-else-if="attemptStarted && !quizCompleted" class="flex flex-col 2xl:flex-row min-h-[calc(100vh-4rem)]">

            <!-- LEFT SIDEBAR - Session & Progress -->
            <aside
                class="hidden 2xl:block w-full 2xl:w-80 flex-shrink-0 p-4 2xl:p-6 border-r border-gh-border/50 bg-gh-bg-secondary/30 order-3 2xl:order-1 space-y-4 2xl:h-[calc(100vh-4rem)] 2xl:overflow-y-auto 2xl:sticky 2xl:top-0">
                <!-- Session Token Card -->
                <Card class="!p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <svg class="w-4 h-4 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <p class="text-xs sm:text-sm font-semibold text-gh-text">Session</p>
                    </div>
                    <code
                        class="text-xs sm:text-sm text-gh-text-muted font-mono bg-gh-bg px-2 py-1 rounded block break-all mb-3">{{ sessionToken }}</code>
                    <button @click="copySessionToken"
                        class="w-full px-3 py-2 bg-gh-accent/10 text-gh-accent text-xs sm:text-sm font-medium rounded-lg hover:bg-gh-accent/20 transition-all border border-gh-accent/20">
                        <span v-if="tokenCopied" class="flex items-center justify-center gap-1">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            Copied!
                        </span>
                        <span v-else>Copy Token</span>
                    </button>
                </Card>

                <Card v-if="participantIdDisplay" class="!p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p class="text-xs sm:text-sm font-semibold text-gh-text">Participant ID</p>
                    </div>
                    <code
                        class="text-xs sm:text-sm text-gh-text-muted font-mono bg-gh-bg px-2 py-1 rounded block break-all mb-3">{{ participantIdDisplay }}</code>
                    <button @click="copyParticipantId"
                        class="w-full px-3 py-2 bg-gh-accent/10 text-gh-accent text-xs sm:text-sm font-medium rounded-lg hover:bg-gh-accent/20 transition-all border border-gh-accent/20">
                        <span v-if="participantIdCopied" class="flex items-center justify-center gap-1">
                            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            Copied!
                        </span>
                        <span v-else>Copy ID</span>
                    </button>
                </Card>

                <!-- Quiz Info Card -->
                <Card class="!p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-xs sm:text-sm font-semibold text-gh-text">Quiz Info</p>
                    </div>
                    <div class="flex items-start justify-between gap-2">
                        <div class="text-sm sm:text-base text-gh-text font-medium mb-1 truncate" :title="quiz.title">{{
                            quiz.title }}
                        </div>
                        <NuxtLink v-if="leaderboardPath" :to="leaderboardPath" class="flex-shrink-0">
                            <Button variant="ghost" size="sm">Leaderboard</Button>
                        </NuxtLink>
                    </div>
                    <div class="text-xs sm:text-sm text-gh-text-muted">{{ participantAlias || 'Anonymous' }}</div>
                </Card>

                <!-- Question Navigation -->
                <Card class="!p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <p class="text-xs sm:text-sm font-semibold text-gh-text">Quiz Map</p>
                    </div>
                    <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        <button v-for="(q, idx) in questions" :key="q.id" @click="navigateToQuestion(idx)"
                            class="aspect-square min-h-[2.75rem] min-w-[2.75rem] rounded text-xs sm:text-sm font-semibold transition-all flex items-center justify-center cursor-pointer hover:opacity-80 hover:scale-105"
                            :class="{
                                'bg-gh-accent text-white shadow-lg': idx === currentQuestionIndex,
                                'bg-green-500/20 text-green-400 border border-green-500/30': idx !== currentQuestionIndex && answers[q.id],
                                'bg-gh-bg text-gh-text-muted border border-gh-border': idx !== currentQuestionIndex && !answers[q.id]
                            }">
                            {{ idx + 1 }}
                        </button>
                    </div>
                </Card>
            </aside>

            <!-- CENTER CONTENT - Main Question Area -->
            <main class="flex-1 w-full py-8 px-4 sm:px-6 md:px-8 2xl:px-12 order-2 2xl:order-2 min-w-0">
                <Card class="!p-0 overflow-hidden border-2 border-gh-border/50 shadow-2xl">
                    <!-- Question Content Area -->
                    <div class="p-6 md:p-10">
                        <!-- Loading State -->
                        <div v-if="loadingQuestion" class="flex flex-col items-center justify-center py-16">
                            <div class="relative">
                                <div
                                    class="animate-spin rounded-full h-16 w-16 border-4 border-gh-accent border-t-transparent">
                                </div>
                                <div class="absolute inset-0 rounded-full h-16 w-16 border-4 border-gh-accent/20">
                                </div>
                            </div>
                            <p class="mt-4 text-gh-text-muted animate-pulse">Loading question...</p>
                        </div>

                        <!-- Question Display -->
                        <div v-else-if="currentQuestion" class="space-y-6">
                            <!-- Question Header -->
                            <div class="relative">
                                <div
                                    class="flex items-start justify-between gap-4 p-6 bg-gradient-to-br from-gh-bg to-gh-card rounded-2xl border border-gh-border/50 shadow-lg">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-3">
                                            <span
                                                class="px-3 py-1 bg-gh-accent/10 text-gh-accent text-xs font-semibold rounded-full border border-gh-accent/20">
                                                {{ currentQuestion.question_type?.replace('_', ' ') }}
                                            </span>
                                            <span
                                                class="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 flex items-center gap-1">
                                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                {{ currentQuestion.points }} points
                                            </span>
                                        </div>
                                        <h3 class="text-2xl font-bold text-gh-text mb-2">
                                            {{ currentQuestion.question_title }}
                                        </h3>
                                        <div v-if="shouldShowQuestionText"
                                            class="text-gh-text text-lg leading-relaxed max-w-full break-words">
                                            <TiptapRenderer :content="currentQuestion.question_text" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Answer Input Section -->
                            <div class="bg-gh-card/30 rounded-2xl p-4 md:p-6 border border-gh-border/30">
                                <QuestionAnswerInput :question="currentQuestion" v-model="currentAnswer" />
                            </div>

                            <!-- Submit Answer Button -->
                            <div class="flex justify-center mt-4">
                                <Button @click="saveCurrentAnswer" :disabled="!currentAnswer || savingAnswer"
                                    :class="answerJustSaved ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'"
                                    class="!px-8 !py-3 hover:scale-105 transition-all shadow-lg">
                                    <span v-if="answerJustSaved" class="flex items-center gap-2">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        Saved!
                                    </span>
                                    <span v-else-if="savingAnswer" class="flex items-center gap-2">
                                        <div
                                            class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent">
                                        </div>
                                        Saving...
                                    </span>
                                    <span v-else class="flex items-center gap-2">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                        Submit Answer
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <!-- Navigation Footer -->
                    <div class="p-6 bg-gradient-to-br from-gh-bg to-gh-card border-t border-gh-border/50">
                        <div class="flex justify-between gap-4">
                            <Button variant="secondary" @click="previousQuestion" :disabled="currentQuestionIndex === 0"
                                class="flex items-center gap-2 !px-6 !py-3 hover:scale-105 transition-transform">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </Button>

                            <Button v-if="currentQuestionIndex < questions.length - 1" @click="nextQuestion"
                                :disabled="!isCurrentQuestionAnswered"
                                class="flex items-center gap-2 !px-6 !py-3 hover:scale-105 transition-transform">
                                Next
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </Button>

                            <Button v-else @click="finishQuiz" :disabled="submitting || !isCurrentQuestionAnswered"
                                class="flex items-center gap-2 !px-8 !py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all shadow-lg">
                                <svg v-if="!submitting" class="w-5 h-5" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div v-else
                                    class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent">
                                </div>
                                {{ submitting ? 'Submitting...' : 'Submit Quiz' }}
                            </Button>
                        </div>
                    </div>
                </Card>
            </main>

            <!-- RIGHT SIDEBAR - Timer & Completion -->
            <aside
                class="hidden 2xl:block w-full 2xl:w-80 flex-shrink-0 p-4 2xl:p-6 border-l border-gh-border/50 bg-gh-bg-secondary/30 order-1 2xl:order-3 space-y-4 2xl:h-[calc(100vh-4rem)] 2xl:overflow-y-auto 2xl:sticky 2xl:top-0">
                <!-- Timer Card -->
                <Card class="!p-4" :class="{
                    '!border-orange-500/50 !bg-orange-500/5': isTimeWarning,
                    '!border-red-500/50 !bg-red-500/5': isTimeExceeded
                }">
                    <div class="flex items-center gap-2 mb-3">
                        <svg class="w-4 h-4" :class="{
                            'text-blue-400': !isTimeWarning && !isTimeExceeded,
                            'text-orange-500': isTimeWarning,
                            'text-red-500': isTimeExceeded
                        }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-xs sm:text-sm font-semibold" :class="{
                            'text-gh-text': !isTimeWarning && !isTimeExceeded,
                            'text-orange-500': isTimeWarning,
                            'text-red-500': isTimeExceeded
                        }">Time</p>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl sm:text-3xl font-bold mb-1" :class="{
                            'text-gh-text': !isTimeWarning && !isTimeExceeded,
                            'text-orange-500': isTimeWarning,
                            'text-red-500 animate-pulse': isTimeExceeded
                        }">{{ formattedElapsedTime }}</div>
                        <div class="text-xs sm:text-sm" :class="{
                            'text-gh-text-muted': !isTimeWarning && !isTimeExceeded,
                            'text-orange-500': isTimeWarning,
                            'text-red-500 font-semibold': isTimeExceeded
                        }">{{ isTimeExceeded ? 'Exceeded' : 'Elapsed' }}</div>
                    </div>
                </Card>

                <!-- Completion Summary -->
                <Card class="!p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-xs sm:text-sm font-semibold text-gh-text">Completion</p>
                    </div>
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm sm:text-base">
                            <span class="text-gh-text-muted">Answered</span>
                            <span class="text-gh-text font-semibold">{{ Object.keys(answers).length }}/{{
                                questions.length }}</span>
                        </div>
                        <div
                            class="relative w-full bg-gray-700 rounded-full h-6 overflow-hidden border border-gray-600">
                            <div class="h-6 rounded-full transition-all duration-500 ease-out bg-green-400 flex items-center justify-center"
                                :style="{ width: `${Math.max(completionPercent, 0)}%` }">
                            </div>
                            <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-xs font-bold"
                                    :class="completionPercent > 10 ? 'text-white' : 'text-gray-200'">
                                    {{ animatedCompletionPercent }}%
                                </span>
                            </div>
                        </div>
                        <div class="text-xs sm:text-sm text-gh-text-muted text-center mt-2">
                            {{ Object.keys(answers).length }}/{{ questions.length }} Answered
                        </div>
                    </div>
                </Card>

            </aside>

            <!-- Mobile Floating Stats Button -->
            <div v-if="attemptStarted && !quizCompleted"
                class="fixed bottom-6 left-6 z-50 2xl:hidden transition-all duration-300"
                :class="showFloatingButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'">
                <!-- Floating Stats Button positioning -->
                <button @click="showMobileStats = !showMobileStats"
                    class="p-4 rounded-full shadow-xl backdrop-blur-md border border-gh-border/50 transition-all hover:scale-105 active:scale-95"
                    :class="showMobileStats ? 'bg-gh-accent text-white' : 'bg-gh-card/80 text-gh-text'">
                    <svg v-if="!showMobileStats" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Mobile Stats Overlay -->
            <div v-if="showMobileStats"
                class="fixed inset-0 z-40 2xl:hidden bg-gh-bg/95 backdrop-blur-sm p-6 flex flex-col items-center justify-start overflow-y-auto animate-fade-in"
                @click.self="showMobileStats = false">
                <div class="max-w-sm mx-auto w-full space-y-4">
                    <h3 class="text-xl sm:text-2xl font-bold text-gh-text text-center mb-4">Quiz Status</h3>

                    <!-- Session Card (Mobile/Tablet) -->
                    <Card class="!p-4">
                        <div class="flex items-center gap-2 mb-3">
                            <svg class="w-4 h-4 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p class="text-xs sm:text-sm font-semibold text-gh-text">Session</p>
                        </div>
                        <code
                            class="text-xs sm:text-sm text-gh-text-muted font-mono bg-gh-bg px-2 py-1 rounded block break-all mb-3">{{ sessionToken }}</code>
                        <button @click="copySessionToken"
                            class="w-full px-3 py-2 bg-gh-accent/10 text-gh-accent text-xs sm:text-sm font-medium rounded-lg hover:bg-gh-accent/20 transition-all border border-gh-accent/20">
                            <span v-if="tokenCopied" class="flex items-center justify-center gap-1">
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                Copied!
                            </span>
                            <span v-else>Copy Token</span>
                        </button>
                    </Card>

                    <Card v-if="participantIdDisplay" class="!p-4">
                        <div class="flex items-center gap-2 mb-3">
                            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p class="text-xs sm:text-sm font-semibold text-gh-text">Participant ID</p>
                        </div>
                        <code
                            class="text-xs sm:text-sm text-gh-text-muted font-mono bg-gh-bg px-2 py-1 rounded block break-all mb-3">{{ participantIdDisplay }}</code>
                        <button @click="copyParticipantId"
                            class="w-full px-3 py-2 bg-gh-accent/10 text-gh-accent text-xs sm:text-sm font-medium rounded-lg hover:bg-gh-accent/20 transition-all border border-gh-accent/20">
                            <span v-if="participantIdCopied" class="flex items-center justify-center gap-1">
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                Copied!
                            </span>
                            <span v-else>Copy ID</span>
                        </button>
                    </Card>

                    <!-- Quiz Map (Mobile/Tablet) -->
                    <Card class="!p-4">
                        <div class="flex items-center gap-2 mb-3">
                            <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <p class="text-xs sm:text-sm font-semibold text-gh-text">Quiz Map</p>
                        </div>
                        <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
                            <button v-for="(q, idx) in questions" :key="q.id" @click="navigateToQuestion(idx)"
                                class="aspect-square min-h-[2.75rem] min-w-[2.75rem] rounded text-xs sm:text-sm font-semibold transition-all flex items-center justify-center cursor-pointer hover:opacity-80 hover:scale-105"
                                :class="{
                                    'bg-gh-accent text-white shadow-lg': idx === currentQuestionIndex,
                                    'bg-green-500/20 text-green-400 border border-green-500/30': idx !== currentQuestionIndex && answers[q.id],
                                    'bg-gh-bg text-gh-text-muted border border-gh-border': idx !== currentQuestionIndex && !answers[q.id]
                                }">
                                {{ idx + 1 }}
                            </button>
                        </div>
                    </Card>

                    <!-- Timer Card (Mobile) -->
                    <Card class="!p-4" :class="{
                        '!border-orange-500/50 !bg-orange-500/5': isTimeWarning,
                        '!border-red-500/50 !bg-red-500/5': isTimeExceeded
                    }">
                        <div class="flex items-center gap-2 mb-3">
                            <svg class="w-4 h-4" :class="{
                                'text-blue-400': !isTimeWarning && !isTimeExceeded,
                                'text-orange-500': isTimeWarning,
                                'text-red-500': isTimeExceeded
                            }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-xs sm:text-sm font-semibold" :class="{
                                'text-gh-text': !isTimeWarning && !isTimeExceeded,
                                'text-orange-500': isTimeWarning,
                                'text-red-500': isTimeExceeded
                            }">Time</p>
                        </div>
                        <div class="text-center">
                            <div class="text-3xl sm:text-4xl font-bold mb-1" :class="{
                                'text-gh-text': !isTimeWarning && !isTimeExceeded,
                                'text-orange-500': isTimeWarning,
                                'text-red-500 animate-pulse': isTimeExceeded
                            }">{{ formattedElapsedTime }}</div>
                            <div class="text-sm sm:text-base" :class="{
                                'text-gh-text-muted': !isTimeWarning && !isTimeExceeded,
                                'text-orange-500': isTimeWarning,
                                'text-red-500 font-semibold': isTimeExceeded
                            }">{{ isTimeExceeded ? 'Exceeded' : 'Elapsed' }}</div>
                        </div>
                    </Card>



                    <!-- Completion Card (Mobile) -->
                    <Card class="!p-4">
                        <div class="flex items-center gap-2 mb-3">
                            <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-xs sm:text-sm font-semibold text-gh-text">Completion</p>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm sm:text-base">
                                <span class="text-gh-text-muted">Answered</span>
                                <span class="text-gh-text font-semibold">{{ Object.keys(answers).length }}/{{
                                    questions.length }}</span>
                            </div>
                            <div
                                class="relative w-full bg-gray-700 rounded-full h-8 overflow-hidden border border-gray-600">
                                <div class="h-8 rounded-full transition-all duration-500 ease-out bg-green-400 flex items-center justify-center"
                                    :style="{ width: `${Math.max(completionPercent, 0)}%` }">
                                </div>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <span class="text-sm font-bold"
                                        :class="completionPercent > 10 ? 'text-white' : 'text-gray-200'">
                                        {{ animatedCompletionPercent }}%
                                    </span>
                                </div>
                            </div>
                            <div class="text-xs sm:text-sm text-gh-text-muted text-center mt-2">
                                {{ Object.keys(answers).length }}/{{ questions.length }} Answered
                            </div>
                        </div>
                    </Card>

                    <Button variant="secondary" @click="showMobileStats = false" class="w-full mt-4">
                        Close
                    </Button>
                </div>
            </div>

        </div>

        <!-- Results Screen -->
        <div v-else-if="quizCompleted && results" class="relative max-w-4xl mx-auto px-4 py-8">
            <!-- Celebration background -->
            <div
                class="absolute -top-20 -right-20 w-96 h-96 bg-green-500 opacity-10 rounded-full blur-3xl -z-10 animate-pulse">
            </div>
            <div
                class="absolute -bottom-20 -left-20 w-80 h-80 bg-gh-accent opacity-10 rounded-full blur-3xl -z-10 animate-pulse">
            </div>

            <Card class="overflow-hidden border-2 border-gh-border/50 shadow-2xl">
                <!-- Hero Section -->
                <div
                    class="text-center mb-8 p-4 md:p-8 bg-gradient-to-br from-green-500/5 to-gh-accent/5 border-b border-gh-border/50">
                    <div class="relative inline-block mb-4 md:mb-6">
                        <div class="absolute inset-0 bg-green-500 opacity-20 rounded-full blur-2xl animate-pulse"></div>
                        <div
                            class="relative p-4 md:p-6 bg-gradient-to-br from-green-500/10 to-gh-accent/10 rounded-full border-4 border-green-500/20">
                            <svg class="w-16 h-16 md:w-20 md:h-20 text-green-500" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <h1
                        class="text-3xl md:text-5xl font-bold text-gh-text mb-2 md:mb-3 bg-gradient-to-r from-green-500 to-gh-accent bg-clip-text">
                        Quiz Completed!
                    </h1>
                    <p class="text-lg md:text-xl text-gh-text-muted">Excellent work, <span
                            class="font-semibold text-gh-text">{{
                                participantAlias }}</span>!</p>
                </div>

                <!-- Results Summary Cards -->
                <div class="p-4 md:p-8">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
                        :class="results.rank ? 'md:grid-cols-4' : 'md:grid-cols-3'">
                        <!-- Score Card -->
                        <div class="relative group">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-gh-accent to-blue-500 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity">
                            </div>
                            <div
                                class="relative text-center p-4 md:p-6 bg-gradient-to-br from-gh-card to-gh-bg border border-gh-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                                <div class="inline-block p-2 md:p-3 bg-gh-accent/10 rounded-xl mb-3">
                                    <svg class="w-6 h-6 md:w-8 md:h-8 text-gh-accent" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <p class="text-xs text-gh-muted font-medium mb-1">Final Score</p>
                                <p class="text-3xl md:text-4xl font-bold text-gh-accent">{{ results.score.toFixed(1) }}
                                </p>
                            </div>
                        </div>

                        <!-- Answered Card -->
                        <div class="relative group">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity">
                            </div>
                            <div
                                class="relative text-center p-4 md:p-6 bg-gradient-to-br from-gh-card to-gh-bg border border-gh-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                                <div class="inline-block p-2 md:p-3 bg-blue-500/10 rounded-xl mb-3">
                                    <svg class="w-6 h-6 md:w-8 md:h-8 text-blue-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <p class="text-xs text-gh-muted font-medium mb-1">Answered</p>
                                <p class="text-3xl md:text-4xl font-bold text-gh-text">{{ results.answered_count }}<span
                                        class="text-base md:text-lg text-gh-muted">/{{ results.total_questions }}</span>
                                </p>
                            </div>
                        </div>

                        <!-- Time Card -->
                        <div class="relative group">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity">
                            </div>
                            <div
                                class="relative text-center p-4 md:p-6 bg-gradient-to-br from-gh-card to-gh-bg border border-gh-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                                <div class="inline-block p-2 md:p-3 bg-purple-500/10 rounded-xl mb-3">
                                    <svg class="w-6 h-6 md:w-8 md:h-8 text-purple-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p class="text-xs text-gh-muted font-medium mb-1">Time Taken</p>
                                <p class="text-2xl md:text-3xl font-bold text-gh-text">{{
                                    formatTime(results.time_taken_ms) }}
                                </p>
                            </div>
                        </div>

                        <!-- Rank Card -->
                        <div v-if="results.rank" class="relative group">
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity">
                            </div>
                            <div
                                class="relative text-center p-4 md:p-6 bg-gradient-to-br from-gh-card to-gh-bg border border-gh-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                                <div class="inline-block p-2 md:p-3 bg-yellow-500/10 rounded-xl mb-3">
                                    <svg class="w-6 h-6 md:w-8 md:h-8 text-yellow-500" fill="currentColor"
                                        viewBox="0 0 20 20">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <p class="text-xs text-gh-muted font-medium mb-1">Your Rank</p>
                                <p class="text-3xl md:text-4xl font-bold text-gh-text">#{{ results.rank }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4">
                        <Button @click="router.push('/public')"
                            class="flex-1 !py-3 bg-gradient-to-r from-gh-accent to-blue-500 hover:from-gh-accent/90 hover:to-blue-600 hover:scale-[1.02] transition-all shadow-lg">
                            <span class="flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Browse Quizzes
                            </span>
                        </Button>
                        <Button variant="secondary" @click="retakeQuiz"
                            class="flex-1 !py-3 hover:scale-[1.02] transition-all">
                            <span class="flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Retake Quiz
                            </span>
                        </Button>
                    </div>
                </div>
                <div v-if="leaderboardPath" class="flex justify-center">
                    <NuxtLink :to="leaderboardPath">
                        <Button variant="secondary" size="lg">View Leaderboard</Button>
                    </NuxtLink>
                </div>
            </Card>
        </div>


        <!-- Confirmation Modal -->
        <Modal v-model="showConfirmModal" title="Start Quiz" size="md">
            <p class="text-gh-text">
                Are you sure you want to continue without selecting an event?
            </p>
            <template #footer="{ close }">
                <Button variant="secondary" full-width @click="close">
                    No
                </Button>
                <Button variant="primary" full-width @click="startQuiz()">
                    Yes
                </Button>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import Alert from '~/components/ui/Alert.vue'
import Input from '~/components/ui/Input.vue'
import OptionCard from '~/components/ui/OptionCard.vue'
import BackButton from '~/components/ui/BackButton.vue'
import QuestionAnswerInput from '~/components/quiz/QuestionAnswerInput.vue'
import TiptapRenderer from '~/components/editor/TiptapRenderer.vue'
import Modal from '~/components/ui/Modal.vue'

const props = defineProps({
    quiz: {
        type: Object,
        required: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: null
    },
    accessCode: {
        type: String,
        default: null
    },
    backPath: {
        type: String,
        default: '/public'
    },
    backTitle: {
        type: String,
        default: 'Back to Quizzes'
    },
    leaderboardPath: {
        type: String,
        default: ''
    },
    memberMode: {
        type: Boolean,
        default: false
    },
    memberApiKey: {
        type: String,
        default: ''
    },
    memberParticipantId: {
        type: String,
        default: ''
    },
    oxideClient: {
        type: Boolean,
        default: false
    },
    urlSessionToken: {
        type: String,
        default: null
    },
})

const router = useRouter()
const route = useRoute()
const { createAttempt, submitAnswer, submitAttempt, getAttempt } = useAttempts()
const { createMemberAttempt, searchMemberEvents } = useMemberClient()
const { getPublicQuestionById } = useQuestions()

const memberMode = computed(() => props.memberMode)

// Use local quiz ref initialized from props, but watch for prop changes
const quizData = ref(props.quiz)

// Alert state
const alertVisible = ref(false)
const alertTitle = ref('')
const alertMessage = ref('')
const alertType = ref('info') // 'info', 'success', 'warning', 'error'

const showAlert = (title, message, type = 'info') => {
    alertTitle.value = title
    alertMessage.value = message
    alertType.value = type
    alertVisible.value = true

    // Auto hide after 5 seconds if not error
    if (type !== 'error') {
        setTimeout(() => {
            alertVisible.value = false
        }, 5000)
    }
}

const closeAlert = () => {
    alertVisible.value = false
}
const questions = ref([]) // Lite question info
const questionDetails = ref({}) // Cache for full question details
const loadingQuestion = ref(false)

// Watch for quiz prop changes
watch(() => props.quiz, (newQuiz) => {
    if (newQuiz) {
        quizData.value = newQuiz
        questions.value = newQuiz.questions || []
        // Try to restore session when quiz is loaded
        tryRestoreSession()
        // Fetch events for member mode
        if (memberMode.value) {
            fetchEvents()
        }
    }
}, { immediate: true })

// Quiz start state
const authMode = ref('alias') // 'alias' or 'id'
const participantAlias = ref('')
const participantId = ref('')
const participantIdValue = ref('')
const enteredAccessCode = ref('')
const aliasError = ref('')
const participantIdError = ref('')
const accessCodeError = ref('')
const starting = ref(false)
const resumeSessionToken = ref('')
const resuming = ref(false)

// Event selection state
const events = ref([])
const selectedEventId = ref(null)
const loadingEvents = ref(false)
const eventSearchQuery = ref('')
const showEventDropdown = ref(false)
const eventDropdownRef = ref(null)
const eventNameContainerRef = ref(null)
const eventNameTextRef = ref(null)
const eventNameOverflows = ref(false)
const showConfirmModal = ref(false)

// Quiz attempt state
const attemptStarted = ref(false)
const sessionToken = ref('')
const currentQuestionIndex = ref(0)
const currentAnswer = ref('')
const answers = ref({}) // Store answers by question ID
const questionStartTimes = ref({}) // Track time spent per question
const tokenCopied = ref(false)
const participantIdCopied = ref(false)
const attemptStartedAt = ref(null) // ISO timestamp from backend
const elapsedSeconds = ref(0) // Current elapsed time in seconds
const timerInterval = ref(null) // setInterval reference
const effectiveTimeLimitSeconds = ref(null) // Effective time limit from attempt

// Quiz completion state
const quizCompleted = ref(false)
const submitting = ref(false)
const savingAnswer = ref(false)
const answerJustSaved = ref(false)
const results = ref(null)

// Mobile UI state
const showFloatingButton = ref(false)
const showMobileStats = ref(false)

// Animated percentage tracking
const animatedProgressPercent = ref(0)
const animatedCompletionPercent = ref(0)

// Session token cookie (expires based on quiz time limit)
// Use current path for unique session key
const cookieName = `quiz_session_${route.params.id || route.params.code}`
const sessionCookie = useCookie(cookieName, {
    maxAge: undefined, // Will be set dynamically based on quiz time limit
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
})

// Computed
const shouldShowQuestionText = computed(() => {
    if (!currentQuestion.value?.question_text) return false

    const type = currentQuestion.value.question_type?.toLowerCase()
    // Don't show text for fill_blank as it's handled by the input component
    return type !== 'fill_blank'
})

const currentQuestion = computed(() => {
    const liteQuestion = questions.value[currentQuestionIndex.value]
    if (!liteQuestion) return null

    // Merge lite question info with full details if available
    const details = questionDetails.value[liteQuestion.id]
    if (details) {
        return {
            ...liteQuestion,
            ...details
        }
    }

    // Return lite question - details will be fetched separately
    return liteQuestion
})

const participantIdDisplay = computed(() => {
    if (props.memberParticipantId) return props.memberParticipantId
    if (participantIdValue.value) return participantIdValue.value
    return participantId.value.trim()
})

// Check if current question has been answered and submitted
const isCurrentQuestionAnswered = computed(() => {
    if (!currentQuestion.value) return false
    return !!answers.value[currentQuestion.value.id]
})

// Calculate percentages
const progressPercent = computed(() => {
    if (questions.value.length === 0) return 0
    return Math.round(((currentQuestionIndex.value + 1) / questions.value.length) * 100)
})

const completionPercent = computed(() => {
    if (questions.value.length === 0) return 0
    return Math.round((Object.keys(answers.value).length / questions.value.length) * 100)
})

// Animate percentage changes
const animatePercentage = (targetValue, currentValue) => {
    const duration = 500
    const startValue = currentValue
    const difference = targetValue - startValue
    const startTime = Date.now()

    const updateValue = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function (ease-out cubic)
        const eased = 1 - Math.pow(1 - progress, 3)

        const newValue = Math.round(startValue + (difference * eased))

        if (progress < 1) {
            requestAnimationFrame(updateValue)
        }

        return newValue
    }

    return updateValue()
}

// Watch for progress changes
watch(progressPercent, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        const startValue = animatedProgressPercent.value
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / 500, 1)
            const eased = 1 - Math.pow(1 - progress, 3)

            animatedProgressPercent.value = Math.round(startValue + ((newValue - startValue) * eased))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        animate()
    }
})

// Watch for completion changes
watch(completionPercent, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        const startValue = animatedCompletionPercent.value
        const startTime = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / 500, 1)
            const eased = 1 - Math.pow(1 - progress, 3)

            animatedCompletionPercent.value = Math.round(startValue + ((newValue - startValue) * eased))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        animate()
    }
})

// Format elapsed time as MM:SS or HH:MM:SS
const formattedElapsedTime = computed(() => {
    const seconds = elapsedSeconds.value
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const pad = (num) => String(num).padStart(2, '0')

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
    }
    return `${pad(minutes)}:${pad(secs)}`
})

// Time remaining in seconds (negative if exceeded)
// Uses effectiveTimeLimitSeconds from attempt (computed at creation, adjusted for HardLimit/events)
const timeRemaining = computed(() => {
    if (!effectiveTimeLimitSeconds.value || effectiveTimeLimitSeconds.value === 0) {
        return null // No time limit
    }
    return effectiveTimeLimitSeconds.value - elapsedSeconds.value
})

// Check if time is running out (≤60 seconds remaining)
const isTimeWarning = computed(() => {
    if (timeRemaining.value === null) return false
    return timeRemaining.value > 0 && timeRemaining.value <= 60
})

// Watch for time warning to show alert
watch(isTimeWarning, (newValue, oldValue) => {
    if (newValue && !oldValue) {
        showAlert('Time Warning', 'You have less than 1 minute remaining!', 'warning')
    }
})

// Check if time has exceeded
const isTimeExceeded = computed(() => {
    if (timeRemaining.value === null) return false
    return timeRemaining.value < 0
})

// Format time limit
const formatTimeLimit = (seconds) => {
    if (seconds === 0) return 'No limit'

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const parts = []
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (secs > 0) parts.push(`${secs}s`)

    return parts.join(' ')
}

// Format time for results
const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}m ${secs}s`
}

// Timer functions - use backend started_at as golden source
const startTimer = (startedAtISO) => {
    attemptStartedAt.value = startedAtISO

    // Calculate initial elapsed time
    const updateElapsed = () => {
        if (!attemptStartedAt.value) return
        const startTime = new Date(attemptStartedAt.value).getTime()
        const now = Date.now()
        elapsedSeconds.value = Math.floor((now - startTime) / 1000)
    }

    updateElapsed() // Update immediately

    // Update every second
    if (timerInterval.value) {
        clearInterval(timerInterval.value)
    }
    timerInterval.value = setInterval(updateElapsed, 1000)
}

const stopTimer = () => {
    if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
    }
}

// Save session token to cookie with expiration based on effective time limit
const saveSessionToken = (token) => {
    // Calculate expiration: effective time limit + 5 second buffer for completion
    const expirationSeconds = (effectiveTimeLimitSeconds.value || quizData.value?.time_limit_seconds || 3600) + 5

    // Set cookie with proper maxAge
    const cookie = useCookie(cookieName, {
        maxAge: expirationSeconds,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
    })

    cookie.value = token
}

// Load session token from cookie
const loadSessionToken = () => {
    return sessionCookie.value || null
}

// Clear session token from cookie
const clearSessionToken = () => {
    sessionCookie.value = null
}

// Copy session token to clipboard
const copySessionToken = async () => {
    try {
        await navigator.clipboard.writeText(sessionToken.value)
        tokenCopied.value = true
        setTimeout(() => {
            tokenCopied.value = false
        }, 2000)
    } catch (e) {
        console.error('Failed to copy session token:', e)
    }
}

const copyParticipantId = async () => {
    if (!participantIdDisplay.value) return

    try {
        await navigator.clipboard.writeText(participantIdDisplay.value)
        participantIdCopied.value = true
        setTimeout(() => {
            participantIdCopied.value = false
        }, 2000)
    } catch (e) {
        console.error('Failed to copy participant ID:', e)
    }
}

// Fetch detailed question data
const fetchQuestionDetails = async (questionId) => {
    // Check if already cached
    if (questionDetails.value[questionId]) {
        return
    }

    loadingQuestion.value = true

    const result = await getPublicQuestionById(questionId, sessionToken.value)

    if (result.success) {
        questionDetails.value[questionId] = result.data.data
    } else {
        console.error('❌ Failed to fetch question:', questionId, result.error)
    }

    loadingQuestion.value = false
}

const hydrateAnswersFromAttempt = (attemptData) => {
    if (!attemptData?.answers || !Array.isArray(attemptData.answers)) {
        answers.value = {}
        return
    }

    const restored = {}

    attemptData.answers.forEach((ans) => {
        if (ans?.question_id) {
            restored[ans.question_id] = ans.user_answer || ''
        }
    })

    answers.value = restored

    if (currentQuestion.value) {
        currentAnswer.value = answers.value[currentQuestion.value.id] || ''
    }
}

// Resume session with existing token
const resumeSession = async () => {
    if (!resumeSessionToken.value) return

    resuming.value = true
    // error.value = null // Don't clear main error, maybe use local error?

    const result = await getAttempt(resumeSessionToken.value)

    if (result.success) {
        // Check response code - AT-003 means in progress, AT-099 means finished
        if (result.code === 'AT-099') {
            showAlert('Already Submitted', result.message || 'This quiz attempt has already been submitted', 'info')
            resuming.value = false
            return
        }

        // AT-003 means attempt is in progress and can be resumed
        if (result.code === 'AT-003') {
            const attemptData = result.data

            // CRITICAL: Validate that this session token belongs to THIS quiz
            if (attemptData.quiz_id !== quizData.value.id) {
                showAlert('Invalid Session', 'This session token is for a different quiz.', 'error')
                resuming.value = false
                return
            }

            sessionToken.value = resumeSessionToken.value
            effectiveTimeLimitSeconds.value = attemptData.effective_time_limit_seconds ?? null
            saveSessionToken(sessionToken.value)
            attemptStarted.value = true
            participantIdValue.value =
                attemptData.participant?.id || attemptData.participant_id || participantId.value.trim()

            hydrateAnswersFromAttempt(attemptData)

            // Start timer using backend's started_at timestamp
            startTimer(attemptData.started_at)

            // Fetch current question details
            if (questions.value.length > 0 && questions.value[currentQuestionIndex.value]) {
                await fetchQuestionDetails(questions.value[currentQuestionIndex.value].id)
            }

            // Start tracking time for current question
            if (currentQuestion.value) {
                currentAnswer.value = answers.value[currentQuestion.value.id] || ''
                questionStartTimes.value[currentQuestion.value.id] = Date.now()
            }
        } else {
            showAlert('Resume Failed', result.message || 'Unable to resume this session', 'error')
        }
    } else {
        showAlert('Resume Failed', result.error || 'Failed to resume session. Please check your session token.', 'error')
    }

    resuming.value = false
}

// Fetch events for the quiz (member mode)
const fetchEvents = async () => {
    if (!props.memberApiKey || !quizData.value?.id) return

    loadingEvents.value = true
    const result = await searchMemberEvents(props.memberApiKey, {
        quizId: quizData.value.id,
        status: 'available',
    })

    if (result.success && result.data?.results) {
        events.value = result.data.results
    } else {
        events.value = []
    }
    loadingEvents.value = false
}

// Event selection helpers
const selectedEvent = computed(() => {
    if (!selectedEventId.value) return null
    return events.value.find(e => e.id === selectedEventId.value) || null
})

const filteredEvents = computed(() => {
    if (!eventSearchQuery.value.trim()) return events.value
    const query = eventSearchQuery.value.toLowerCase().trim()
    return events.value.filter(e =>
        e.name.toLowerCase().includes(query) ||
        (e.quiz_title && e.quiz_title.toLowerCase().includes(query))
    )
})

const selectEvent = (event) => {
    if (selectedEventId.value === event.id) {
        selectedEventId.value = null
    } else {
        selectedEventId.value = event.id
    }
    eventSearchQuery.value = ''
    showEventDropdown.value = false
}

const clearSelectedEvent = () => {
    selectedEventId.value = null
    eventSearchQuery.value = ''
}

const formatEventDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

// Check if event name text overflows its container
const checkEventNameOverflow = () => {
    nextTick(() => {
        const container = eventNameContainerRef.value
        const text = eventNameTextRef.value
        if (container && text) {
            eventNameOverflows.value = text.scrollWidth > container.clientWidth
        } else {
            eventNameOverflows.value = false
        }
    })
}

// Re-check overflow when selected event changes or window resizes
watch(selectedEvent, () => {
    checkEventNameOverflow()
})

let eventNameResizeObserver = null
watch(eventNameContainerRef, (el, oldEl) => {
    if (eventNameResizeObserver) {
        eventNameResizeObserver.disconnect()
        eventNameResizeObserver = null
    }
    if (el) {
        eventNameResizeObserver = new ResizeObserver(() => checkEventNameOverflow())
        eventNameResizeObserver.observe(el)
    }
})

// Close event dropdown on outside click
const handleClickOutside = (e) => {
    if (eventDropdownRef.value && !eventDropdownRef.value.contains(e.target)) {
        showEventDropdown.value = false
    }
}

// Start quiz
const startQuiz = async () => {
    aliasError.value = ''
    participantIdError.value = ''
    accessCodeError.value = ''

    if (memberMode.value) {
        showConfirmModal.value = false
        if (!props.memberApiKey || !props.memberParticipantId) {
            showAlert('Access Missing', 'Member access credentials are missing. Please open the member link again.', 'error')
            return
        }

        starting.value = true

        const result = await createMemberAttempt(
            quizData.value.id,
            props.memberParticipantId,
            props.memberApiKey,
            selectedEventId.value
        )

        if (result.success) {
            sessionToken.value = result.data.session_token
            effectiveTimeLimitSeconds.value = result.data.effective_time_limit_seconds
            saveSessionToken(sessionToken.value)
            attemptStarted.value = true
            participantAlias.value = result.data.alias || ''
            participantIdValue.value = props.memberParticipantId || participantId.value.trim()
            startTimer(result.data.started_at)

            if (questions.value.length > 0) {
                await fetchQuestionDetails(questions.value[0].id)
            }

            if (currentQuestion.value) {
                questionStartTimes.value[currentQuestion.value.id] = Date.now()
            }
        } else {
            showAlert('Start Failed', result.error || 'Failed to start quiz', 'error')
        }

        starting.value = false
        return
    }

    // Validate based on mode
    if (authMode.value === 'alias') {
        if (!participantAlias.value.trim()) {
            aliasError.value = 'Please enter your name or alias'
            return
        }
    } else {
        if (!participantId.value.trim()) {
            participantIdError.value = 'Please enter your participant ID'
            return
        }
    }

    // Check access code if quiz has one and it wasn't passed via props
    if (quizData.value.access_code && !props.accessCode) {
        if (enteredAccessCode.value !== quizData.value.access_code) {
            accessCodeError.value = 'Invalid access code'
            return
        }
    }

    starting.value = true

    // Use prop access code if available (shared link), otherwise use entered code
    const codeToUse = props.accessCode || (quizData.value.access_code ? enteredAccessCode.value : undefined)

    // Prepare payload based on mode
    const aliasToSend = authMode.value === 'alias' ? participantAlias.value.trim() : undefined
    const idToSend = authMode.value === 'id' ? participantId.value.trim() : undefined

    const result = await createAttempt(quizData.value.id, aliasToSend, codeToUse, idToSend)

    if (result.success) {
        sessionToken.value = result.data.session_token
        effectiveTimeLimitSeconds.value = result.data.effective_time_limit_seconds
        saveSessionToken(sessionToken.value)
        attemptStarted.value = true
        participantAlias.value = result.data.alias || ''
        participantIdValue.value = idToSend || participantId.value.trim()
        // Start timer using backend's started_at timestamp
        startTimer(result.data.started_at)

        // Fetch first question details
        if (questions.value.length > 0) {
            await fetchQuestionDetails(questions.value[0].id)
        }

        // Start tracking time for first question
        if (currentQuestion.value) {
            questionStartTimes.value[currentQuestion.value.id] = Date.now()
        }
    } else {
        // Show error in alert or local state instead of replacing main error
        showAlert('Start Failed', result.error || 'Failed to start quiz', 'error')
    }

    starting.value = false
}

// Save current answer
const saveCurrentAnswer = async () => {
    if (!currentAnswer.value || !currentQuestion.value) return

    savingAnswer.value = true

    const questionId = currentQuestion.value.id
    const timeSpent = questionStartTimes.value[questionId]
        ? Math.floor(Date.now() - questionStartTimes.value[questionId])
        : 0

    // Store answer locally
    answers.value[questionId] = currentAnswer.value

    // Submit to server
    const result = await submitAnswer(
        sessionToken.value,
        questionId,
        currentAnswer.value,
        timeSpent
    )

    savingAnswer.value = false

    // Show success or error feedback
    if (result.success) {
        showAlert('Answer Saved', 'Your answer has been saved successfully.', 'success')
        answerJustSaved.value = true
        setTimeout(() => {
            answerJustSaved.value = false
        }, 2000)
    } else {
        // Handle time limit exceeded
        if (result.code === 'AT-409') {
            showAlert('Time Limit Exceeded', 'Time limit exceeded! Submitting quiz...', 'warning')
            submitting.value = true

            // Attempt to submit the quiz to get results
            const submitResult = await submitAttempt(sessionToken.value)

            if (!submitResult.success) {
                if (submitResult.code === 'AT-405') {
                    const attemptResult = await getAttempt(sessionToken.value)
                    if (attemptResult.success && attemptResult.data.submitted_at !== null) {
                        results.value = attemptResult.data
                        quizCompleted.value = true
                        stopTimer()
                        clearSessionToken()
                        showAlert('Quiz Completed', 'time limit exceeded! Your quiz has been submitted.', 'info')
                    } else {
                        // Fallback if we can't get results
                        quizCompleted.value = true
                        stopTimer()
                        clearSessionToken()
                        showAlert('Quiz Completed', 'Your quiz was already submitted.', 'info')
                    }
                    return
                } else {
                    showAlert('Submission Failed', submitResult.error || 'Failed to submit quiz after time limit exceeded.', 'error')
                }
            } else {
                results.value = submitResult.data
                quizCompleted.value = true
                stopTimer()
                clearSessionToken()
                return
            }

            submitting.value = false
            return
        }

        // Handle already submitted (AT-405)
        if (result.code === 'AT-405') {
            // Quiz is already submitted, so we should just show the results screen
            quizCompleted.value = true
            stopTimer()
            clearSessionToken()
            showAlert('Quiz Completed', 'This quiz has already been submitted.', 'info')
            return
        }

        showAlert('Save Failed', result.error || 'Failed to save answer. Your answer is stored locally.', 'error')
    }
}

// Navigate to next question
const nextQuestion = async () => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
        answerJustSaved.value = false
        currentQuestionIndex.value++
        // Watch will handle fetching details and loading answer
    }
}

// Navigate to previous question
const previousQuestion = async () => {
    if (currentQuestionIndex.value > 0) {
        answerJustSaved.value = false
        currentQuestionIndex.value--
        // Watch will handle fetching details and loading answer
    }
}

// Navigate to specific question (used by quiz map)
const navigateToQuestion = async (index) => {
    if (index === currentQuestionIndex.value) return

    answerJustSaved.value = false
    currentQuestionIndex.value = index
    // Watch will handle fetching details and loading answer
}

// Finish quiz
const finishQuiz = async () => {
    // Save current answer first
    await saveCurrentAnswer()

    submitting.value = true

    const result = await submitAttempt(sessionToken.value)
    if (result.success) {
        results.value = result.data
        quizCompleted.value = true
        // Stop timer
        stopTimer()
        // Clear session from storage after completion
        clearSessionToken()
    } else {
        // Handle already submitted case (AT-405)
        if (result.code === 'AT-405') {
            // Treat as success - fetch results if possible or just show completion
            // Since we can't easily get results without another call, we might need to handle that
            // But for now, let's assume we can just mark as completed
            // Ideally, the backend should return results even if already submitted, or we fetch them

            // If the error response contains data (it might not), use it. 
            // Otherwise we might need to fetch the attempt details again to get the results.
            // For now, let's try to fetch the attempt again to get the results/score

            const attemptResult = await getAttempt(sessionToken.value)
            if (attemptResult.success && attemptResult.data.submitted_at !== null) {
                results.value = attemptResult.data
                quizCompleted.value = true
                stopTimer()
                clearSessionToken()
                showAlert('Quiz Completed', 'Your quiz has been submitted successfully.', 'success')
            } else {
                // Fallback if we can't get results
                quizCompleted.value = true
                stopTimer()
                clearSessionToken()
                showAlert('Quiz Completed', 'Your quiz was already submitted.', 'info')
            }
        } else {
            showAlert('Submission Failed', result.error || 'An error occurred while submitting the quiz.', 'error')
        }
    }

    submitting.value = false
}

// Retake quiz
const retakeQuiz = () => {
    // Clear session token from storage
    clearSessionToken()

    // Stop timer
    stopTimer()

    // Reset all state
    attemptStarted.value = false
    quizCompleted.value = false
    sessionToken.value = ''
    currentQuestionIndex.value = 0
    currentAnswer.value = ''
    answers.value = {}
    questionStartTimes.value = {}
    results.value = null
    // Don't reset participant info so they can easily retake
    participantAlias.value = ''
    // participantId.value = ''
    enteredAccessCode.value = ''
    resumeSessionToken.value = ''
    attemptStartedAt.value = null
    elapsedSeconds.value = 0
}

// Try to restore session on mount
const tryRestoreSession = async () => {
    // First check urlSessionToken prop (from mobile client / validated URL token)
    // Then fall back to cookie
    const savedToken = props.urlSessionToken || loadSessionToken()
    if (savedToken && quizData.value) {
        const result = await getAttempt(savedToken)

        // Only restore if AT-003 (in progress) AND quiz_id matches
        if (result.success && result.code === 'AT-003') {
            const attemptData = result.data
            participantAlias.value = attemptData.participant?.alias || ''
            participantIdValue.value =
                attemptData.participant?.id || attemptData.participant_id || participantId.value.trim()
            // Validate that this session token belongs to THIS quiz
            if (attemptData.quiz_id !== quizData.value.id) {
                // Session is for a different quiz, clear it (only if not from URL prop)
                if (!props.urlSessionToken) {
                    clearSessionToken()
                }
                return
            }

            // Valid session found, restore it
            sessionToken.value = savedToken
            effectiveTimeLimitSeconds.value = attemptData.effective_time_limit_seconds ?? null
            attemptStarted.value = true

            hydrateAnswersFromAttempt(attemptData)

            // Start timer using backend's started_at timestamp
            startTimer(attemptData.started_at)

            // Fetch current question details
            if (questions.value.length > 0 && questions.value[currentQuestionIndex.value]) {
                await fetchQuestionDetails(questions.value[currentQuestionIndex.value].id)
            }

            // Start tracking time for current question
            if (currentQuestion.value) {
                currentAnswer.value = answers.value[currentQuestion.value.id] || ''
                questionStartTimes.value[currentQuestion.value.id] = Date.now()
            }
        } else {
            // Invalid or completed session, clear it (only if not from URL prop)
            if (!props.urlSessionToken) {
                clearSessionToken()
            }
        }
    }
}

// Watch for question index changes and auto-fetch details
watch(currentQuestionIndex, async (newIndex) => {
    const question = questions.value[newIndex]
    if (question && attemptStarted.value) {
        await fetchQuestionDetails(question.id)

        // Load saved answer after details are fetched
        currentAnswer.value = answers.value[question.id] || ''

        // Start tracking time for this question if not already tracking
        if (!questionStartTimes.value[question.id]) {
            questionStartTimes.value[question.id] = Date.now()
        }
    }
}, { immediate: true })

// Floating button visibility for mobile/tablet
const updateFloatingVisibility = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0
    showFloatingButton.value = width === 0 ? true : width < 1536
}

onMounted(() => {
    window.addEventListener('resize', updateFloatingVisibility)
    document.addEventListener('click', handleClickOutside)
    updateFloatingVisibility()
    // Initialize animated percentages
    animatedProgressPercent.value = progressPercent.value
    animatedCompletionPercent.value = completionPercent.value
})

// Clean up timer on unmount
onUnmounted(() => {
    window.removeEventListener('resize', updateFloatingVisibility)
    document.removeEventListener('click', handleClickOutside)
    if (eventNameResizeObserver) {
        eventNameResizeObserver.disconnect()
        eventNameResizeObserver = null
    }
    stopTimer()
})
</script>

<style scoped>
.event-badge-marquee {
    display: inline-block;
    animation: event-marquee 10s linear infinite;
}

@keyframes event-marquee {
    0% {
        transform: translateX(0%);
    }
    10% {
        transform: translateX(0%);
    }
    90% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(-100%);
    }
}
</style>
