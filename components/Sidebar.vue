<template>
  <div class="sidebar-container">
    <!-- Toggle Button (Desktop) -->
    <button
      v-if="!isMobile"
      @click="toggleSidebar"
      class="sidebar-toggle"
      :class="{ collapsed: !isSidebarVisible }"
      :title="isSidebarVisible ? 'Hide Sidebar (Ctrl+B)' : 'Show Sidebar (Ctrl+B)'"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          v-if="isSidebarVisible"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 5l7 7-7 7M5 5l7 7-7 7"
        />
      </svg>
    </button>

    <!-- Mobile Header -->
    <div class="mobile-header">
      <NuxtLink to="/" class="logo flex items-center gap-2">
        <img :src="theme === 'dark' ? '/whitelogo.png' : '/blacklogo.png'" alt="Logo" class="w-8 h-8" />
        <span>QuizOxide</span>
      </NuxtLink>

      <div class="mobile-controls">
        <!-- Theme Toggle (Mobile) -->
        <button
          @click="toggleTheme"
          class="icon-button"
          :title="
            theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
          "
        >
          <svg
            v-if="theme === 'dark'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        <!-- Mobile Menu Toggle -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="icon-button"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="sidebar" :class="{ collapsed: !isSidebarVisible }">
      <!-- Logo Section -->
      <div class="sidebar-logo">
        <NuxtLink to="/" class="logo-link">
          <img :src="theme === 'dark' ? '/whitelogo.png' : '/blacklogo.png'" alt="Logo" class="w-8 h-8" />
          <span class="logo-text">QuizOxide</span>
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <!-- Public Section -->
        <div class="nav-section">
          <p class="section-label">Public</p>
          <NuxtLink to="/public" class="sidebar-link">
            <svg
              class="link-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Public Quizzes</span>
          </NuxtLink>
          <NuxtLink to="/public/join" class="sidebar-link">
            <svg
              class="link-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span>Join Quiz</span>
          </NuxtLink>
          <NuxtLink to="/member" class="sidebar-link">
            <svg
              class="link-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm-6 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm6 6c-2.33 0-4.31-.97-5.5-2.5a6.97 6.97 0 01-1.5-4.5c0-3.866 3.134-7 7-7s7 3.134 7 7a6.97 6.97 0 01-1.5 4.5C16.31 16.03 14.33 17 12 17z"
              />
            </svg>
            <span>Member Quizzes</span>
          </NuxtLink>
          <a :href="docsUrl" target="_blank" class="sidebar-link">
            <svg
              class="link-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Documentation & Guide</span>
          </a>
          <NuxtLink to="/roadmap" class="sidebar-link">
            <svg
              class="link-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <span>Roadmap</span>
          </NuxtLink>
        </div>

        <ClientOnly>
          <!-- Dashboard Section (Authenticated) -->
          <template v-if="isAuthenticated">
            <div class="nav-section">
              <p class="section-label">Dashboard</p>
              <NuxtLink to="/dashboard" class="sidebar-link">
                <svg
                  class="link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Dashboard</span>
              </NuxtLink>
              <NuxtLink to="/questions" class="sidebar-link">
                <svg
                  class="link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Questions</span>
              </NuxtLink>
              <NuxtLink to="/quizzes" class="sidebar-link">
                <svg
                  class="link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span>Quizzes</span>
              </NuxtLink>
              <NuxtLink to="/events" class="sidebar-link">
                <svg
                  class="link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Events</span>
              </NuxtLink>
              <NuxtLink to="/participants" class="sidebar-link">
                <svg
                  class="link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.75"
                    d="M12 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z
       M5 20v-1a5 5 0 015-5h4a5 5 0 015 5v1
       M17.5 11a2.5 2.5 0 100-5
       M19 20v-1a4 4 0 00-2.5-3.7"
                  />
                </svg>
                <span>Participants</span>
              </NuxtLink>

              <NuxtLink to="/apikeys" class="sidebar-link">
                <svg
                  class="link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span>API Keys</span>
              </NuxtLink>
            </div>
          </template>
        </ClientOnly>
      </nav>

      <!-- Bottom Section -->
      <div class="sidebar-footer">
        <ClientOnly>
          <template v-if="isAuthenticated">
            <button @click="logout" class="sidebar-link logout-button">
              <svg
                class="link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </template>

          <template v-else>
            <div class="auth-buttons">
              <NuxtLink to="/login" class="sidebar-link">
                <svg
                  class="link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span>Login</span>
              </NuxtLink>
              <NuxtLink to="/register" class="sidebar-link accent-link">
                <svg
                  class="link-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <span>Sign Up</span>
              </NuxtLink>
            </div>
          </template>
        </ClientOnly>

        <!-- Theme Toggle (Desktop) -->
        <button
          @click="toggleTheme"
          class="sidebar-link theme-toggle"
          :title="
            theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
          "
        >
          <svg
            v-if="theme === 'dark'"
            class="link-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            class="link-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <span>{{ theme === "dark" ? "Light Mode" : "Dark Mode" }}</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div
        v-if="isMobileMenuOpen"
        class="mobile-overlay"
        @click="isMobileMenuOpen = false"
      ></div>
    </Transition>

    <!-- Mobile Menu Drawer -->
    <Transition name="slide">
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <nav class="mobile-nav">
          <!-- Public Section -->
          <div class="nav-section">
            <p class="section-label">Public</p>
            <NuxtLink to="/public" class="mobile-link" @click="closeMobileMenu">
              <svg
                class="link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Public Quizzes</span>
            </NuxtLink>
            <NuxtLink
              to="/public/join"
              class="mobile-link"
              @click="closeMobileMenu"
            >
              <svg
                class="link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>Join Quiz</span>
            </NuxtLink>
            <NuxtLink to="/member" class="mobile-link" @click="closeMobileMenu">
              <svg
                class="link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm-6 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm6 6c-2.33 0-4.31-.97-5.5-2.5a6.97 6.97 0 01-1.5-4.5c0-3.866 3.134-7 7-7s7 3.134 7 7a6.97 6.97 0 01-1.5 4.5C16.31 16.03 14.33 17 12 17z"
                />
              </svg>
              <span>Member Quizzes</span>
            </NuxtLink>
            <a :href="docsUrl" target="_blank" class="mobile-link" @click="closeMobileMenu">
              <svg
                class="link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Documentation & Guide</span>
            </a>
            <NuxtLink to="/roadmap" class="mobile-link" @click="closeMobileMenu">
              <svg
                class="link-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span>Roadmap</span>
            </NuxtLink>
          </div>

          <ClientOnly>
            <template v-if="isAuthenticated">
              <div class="nav-section">
                <p class="section-label">Dashboard</p>
                <NuxtLink
                  to="/dashboard"
                  class="mobile-link"
                  @click="closeMobileMenu"
                >
                  <svg
                    class="link-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>Dashboard</span>
                </NuxtLink>
                <NuxtLink
                  to="/questions"
                  class="mobile-link"
                  @click="closeMobileMenu"
                >
                  <svg
                    class="link-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Questions</span>
                </NuxtLink>
                <NuxtLink
                  to="/quizzes"
                  class="mobile-link"
                  @click="closeMobileMenu"
                >
                  <svg
                    class="link-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <span>Quizzes</span>
                </NuxtLink>
                <NuxtLink
                  to="/events"
                  class="mobile-link"
                  @click="closeMobileMenu"
                >
                  <svg
                    class="link-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Events</span>
                </NuxtLink>
                <NuxtLink
                  to="/apikeys"
                  class="mobile-link"
                  @click="closeMobileMenu"
                >
                  <svg
                    class="link-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                  <span>API Keys</span>
                </NuxtLink>
                <button @click="handleLogout" class="mobile-link logout-button">
                  <svg
                    class="link-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </template>

            <template v-else>
              <div class="nav-section">
                <NuxtLink
                  to="/login"
                  class="mobile-link"
                  @click="closeMobileMenu"
                >
                  <svg
                    class="link-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Login</span>
                </NuxtLink>
                <NuxtLink
                  to="/register"
                  class="mobile-link accent-link"
                  @click="closeMobileMenu"
                >
                  <svg
                    class="link-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span>Sign Up</span>
                </NuxtLink>
              </div>
            </template>
          </ClientOnly>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const docsUrl = config.public.docsUrl;

const { isAuthenticated, logout } = useAuth();
const { theme, toggleTheme, initTheme } = useTheme();
const { isSidebarVisible, toggleSidebar } = useSidebar();
const isMobileMenuOpen = ref(false);
const isMobile = ref(false);

onMounted(() => {
  initTheme();
  checkMobile();
  window.addEventListener('resize', checkMobile);
  window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile);
  window.removeEventListener('keydown', handleKeyPress);
});

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

const handleKeyPress = (e) => {
  // Ctrl+B or Cmd+B
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    e.preventDefault();
    if (!isMobile.value) {
      toggleSidebar();
    }
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  closeMobileMenu();
  logout();
};
</script>

<style scoped>
/* Container */
.sidebar-container {
  position: relative;
}

/* Toggle Button */
.sidebar-toggle {
  position: fixed;
  left: 15rem;
  top: 1.5rem;
  z-index: 45;
  padding: 0.5rem;
  background: var(--color-gh-card);
  border: 1px solid var(--color-gh-border);
  border-radius: 0.5rem;
  color: var(--color-gh-text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle:hover {
  color: var(--color-gh-accent);
  border-color: var(--color-gh-accent);
  background: color-mix(in srgb, var(--color-gh-accent) 5%, var(--color-gh-card));
  transform: scale(1.05);
}

.sidebar-toggle.collapsed {
  left: 1rem;
}

/* Mobile Header */
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  padding: 0 1rem;
  background: var(--color-gh-card);
  border-bottom: 1px solid var(--color-gh-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gh-text);
  text-decoration: none;
  transition: color 0.3s ease;
}

.logo:hover {
  color: var(--color-gh-accent);
}

.mobile-controls {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  padding: 0.5rem;
  color: var(--color-gh-text-muted);
  background: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-button:hover {
  color: var(--color-gh-accent);
  background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
}

/* Desktop Sidebar */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 16rem;
  background: var(--color-gh-card);
  border-right: 1px solid var(--color-gh-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  z-index: 40;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.collapsed {
  transform: translateX(-100%);
}

.sidebar-logo {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-gh-border);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gh-text);
  transition: color 0.3s ease;
}

.logo-link:hover .logo-text {
  color: var(--color-gh-accent);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gh-text-muted);
  margin-bottom: 0.5rem;
  padding: 0 0.75rem;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  color: var(--color-gh-text-muted);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.sidebar-link:hover {
  color: var(--color-gh-text);
  background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
  transform: translateX(4px);
}

.sidebar-link.router-link-active {
  color: var(--color-gh-accent);
  background: color-mix(in srgb, var(--color-gh-accent) 15%, transparent);
  font-weight: 600;
}

.link-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.accent-link {
  color: var(--color-gh-accent);
  background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
  font-weight: 600;
}

.accent-link:hover {
  background: color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
}

/* Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-gh-border);
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.logout-button {
  color: var(--color-gh-danger);
}

.logout-button:hover {
  background: color-mix(in srgb, var(--color-gh-danger) 10%, transparent);
}

.theme-toggle {
  margin-top: 0.5rem;
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 45;
}

/* Mobile Menu Drawer */
.mobile-menu {
  position: fixed;
  top: 4rem;
  left: 0;
  bottom: 0;
  width: 16rem;
  background: var(--color-gh-card);
  border-right: 1px solid var(--color-gh-border);
  overflow-y: auto;
  z-index: 50;
}

.mobile-nav {
  padding: 1rem 0;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-gh-text-muted);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.mobile-link:hover {
  color: var(--color-gh-text);
  background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
}

.mobile-link.router-link-active {
  color: var(--color-gh-accent);
  background: color-mix(in srgb, var(--color-gh-accent) 15%, transparent);
  font-weight: 600;
}

/* Responsive - Hide/Show Elements */
@media (max-width: 767px) {
  .sidebar {
    display: none;
  }
}

@media (min-width: 768px) {
  .mobile-header {
    display: none;
  }

  .mobile-menu {
    display: none;
  }

  .mobile-overlay {
    display: none;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
