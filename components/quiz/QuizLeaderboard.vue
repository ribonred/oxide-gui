<template>
    <div class="space-y-4 w-full">
        <!-- Participant Detail Modal -->
        <div v-if="showParticipantModal" @click="showParticipantModal = false"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div @click.stop
                class="bg-gh-card border-2 border-gh-accent rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-scale-in">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold text-gh-text">Participant Details</h3>
                    <button @click="showParticipantModal = false"
                        class="text-gh-text-muted hover:text-gh-text transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="space-y-4">
                    <div class="bg-gh-bg-secondary rounded-xl p-4 border border-gh-border">
                        <label class="text-sm font-semibold text-gh-text-muted uppercase tracking-wide mb-2 block">Name
                            / Alias</label>
                        <p class="text-xl font-bold text-gh-accent">{{ selectedParticipant?.alias }}</p>
                    </div>

                    <div class="bg-gh-bg-secondary rounded-xl p-4 border border-gh-border">
                        <label
                            class="text-sm font-semibold text-gh-text-muted uppercase tracking-wide mb-2 block">Participant
                            ID</label>
                        <div class="flex items-center gap-2">
                            <code
                                class="flex-1 text-sm text-gh-text font-mono bg-gh-bg p-2 rounded border border-gh-border break-all">{{ selectedParticipant?.id }}</code>
                            <button @click="copyToClipboard(selectedParticipant?.id)"
                                class="p-2 hover:bg-gh-accent/20 rounded transition-colors" title="Copy to clipboard">
                                <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                        <p v-if="copied" class="text-xs text-green-500 mt-2 animate-fade-in">✓ Copied to clipboard!</p>
                    </div>
                </div>

                <button @click="showParticipantModal = false"
                    class="mt-6 w-full bg-gh-accent hover:bg-gh-accent-hover text-white font-semibold py-3 rounded-lg transition-colors">
                    Close
                </button>
            </div>
        </div>

        <!-- Header with Controls -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3 flex-wrap">
                <h2 class="text-lg md:text-xl font-bold text-gh-text">Leaderboard</h2>
                <Select v-model="selectedRank" class="w-28 md:w-32">
                    <option value="top5">Top 5</option>
                    <option value="top10">Top 10</option>
                    <option value="top20">Top 20</option>
                    <option value="top50">Top 50</option>
                    <option value="top100">Top 100</option>
                </Select>
            </div>

            <div class="flex items-center gap-2">
                <Button variant="secondary" size="sm" @click="exportData('csv')">
                    <svg class="w-4 h-4 md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="hidden md:inline">CSV</span>
                </Button>
                <Button variant="secondary" size="sm" @click="fetchLeaderboard" :disabled="loading">
                    <svg class="w-4 h-4 md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span class="hidden md:inline">Refresh</span>
                </Button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && !rowData.length" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gh-accent"></div>
        </div>

        <!-- Error State -->
        <Alert v-else-if="error" variant="error">
            {{ error }}
        </Alert>

        <!-- Empty State -->
        <div v-else-if="!rowData.length"
            class="text-center py-12 bg-gh-bg-secondary rounded-lg border border-gh-border border-dashed">
            <svg class="w-12 h-12 mx-auto text-gh-text-muted mb-3" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            <p class="text-gh-text-muted">No attempts recorded yet.</p>
        </div>

        <template v-else>
            <!-- Top 3 Podium -->
            <div v-if="rowData.length >= 3" class="podium-container">
                <div class="podium-wrapper">
                    <!-- 2nd Place -->
                    <div class="podium-item podium-2">
                        <div class="podium-profile">
                            <div class="profile-avatar avatar-top">
                                <span class="avatar-text">{{ rowData[1]?.participant_alias?.charAt(0).toUpperCase() ||
                                    'A' }}</span>
                            </div>
                            <div class="podium-info">
                                <h3 class="podium-name">{{ rowData[1]?.participant_alias || 'Anonymous' }}</h3>
                                <p class="podium-level">Score: {{ rowData[1]?.best_score?.toFixed(1) || '0.0' }}</p>
                            </div>
                        </div>
                        <div class="podium-rank-box">
                            <span class="podium-rank-number">2</span>
                        </div>
                    </div>

                    <!-- 1st Place -->
                    <div class="podium-item podium-1">
                        <div class="podium-profile">
                            <div class="profile-avatar avatar-top">
                                <span class="avatar-text">{{ rowData[0]?.participant_alias?.charAt(0).toUpperCase() ||
                                    'A' }}</span>
                            </div>
                            <div class="podium-info">
                                <h3 class="podium-name">{{ rowData[0]?.participant_alias || 'Anonymous' }}</h3>
                                <p class="podium-level">Score: {{ rowData[0]?.best_score?.toFixed(1) || '0.0' }}</p>
                            </div>
                        </div>
                        <div class="podium-rank-box">
                            <span class="podium-rank-number">1</span>
                        </div>
                    </div>

                    <!-- 3rd Place -->
                    <div class="podium-item podium-3">
                        <div class="podium-profile">
                            <div class="profile-avatar avatar-top">
                                <span class="avatar-text">{{ rowData[2]?.participant_alias?.charAt(0).toUpperCase() ||
                                    'A' }}</span>
                            </div>
                            <div class="podium-info">
                                <h3 class="podium-name">{{ rowData[2]?.participant_alias || 'Anonymous' }}</h3>
                                <p class="podium-level">Score: {{ rowData[2]?.best_score?.toFixed(1) || '0.0' }}</p>
                            </div>
                        </div>
                        <div class="podium-rank-box">
                            <span class="podium-rank-number">3</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Leaderboard Table (AG Grid) -->
            <div v-if="rowData.length > 0" class="leaderboard-wrapper">
                <div class="leaderboard-container">
                    <ClientOnly fallback-tag="div" placeholder-tag="div">
                        <AgGridVue class="ag-theme-alpine leaderboard-grid" :style="gridStyle"
                            :gridOptions="gridOptions" :rowData="rowData" :columnDefs="columnDefs"
                            :defaultColDef="defaultColDef" :context="{ showParticipantDetail }"
                            :rowHeight="gridRowHeight" :headerHeight="gridHeaderHeight" :domLayout="'normal'"
                            :pagination="true" :paginationPageSize="itemsPerPage" :suppressPaginationPanel="true"
                            :suppressCellFocus="true" :animateRows="false" @grid-ready="onGridReady"
                            @pagination-changed="onPaginationChanged" />
                    </ClientOnly>

                    <!-- Pagination -->
                    <div class="leaderboard-pagination">
                        <div class="pagination-info">
                            <span class="hidden md:inline">Showing {{ (currentPage - 1) * itemsPerPage + 1 }} - {{
                                Math.min(currentPage * itemsPerPage, rowData.length) }} of</span>
                            <span class="font-semibold">{{ rowData.length }}</span>
                        </div>
                        <div class="pagination-controls">
                            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                                class="pagination-btn">
                                <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span class="page-number text-sm md:text-base">{{ currentPage }} / {{ totalPages }}</span>
                            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                                class="pagination-btn">
                                <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <select v-model.number="itemsPerPage" class="items-per-page text-xs md:text-sm">
                            <option :value="10">10 / page</option>
                            <option :value="20">20 / page</option>
                            <option :value="50">50 / page</option>
                        </select>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import Button from '~/components/ui/Button.vue'
import Alert from '~/components/ui/Alert.vue'
import Select from '~/components/ui/Select.vue'

// AG Grid v34+ requires explicit module registration.
// Guarded to avoid registering multiple times during HMR.
if (!globalThis.__quizServiceAgGridRegistered) {
    ModuleRegistry.registerModules([AllCommunityModule])
    globalThis.__quizServiceAgGridRegistered = true
}

const { theme } = useTheme()

const showParticipantModal = ref(false)
const selectedParticipant = ref(null)
const copied = ref(false)

const props = defineProps({
    quizId: {
        type: [String, Number],
        required: true
    },
    publicMode: {
        type: Boolean,
        default: false,
    },
})

const { getQuizLeaderboard, getPublicQuizLeaderboard } = useQuizzes()

const loading = ref(false)
const error = ref(null)
const rowData = ref([])
const selectedRank = ref('top10')

// Responsive state
const isMobile = ref(false)
const isTablet = ref(false)

const updateResponsive = () => {
    isMobile.value = window.innerWidth < 768
    isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024
}

const gridRowHeight = computed(() => (isMobile.value ? 34 : 40))
const gridHeaderHeight = computed(() => (isMobile.value ? 34 : 40))
const gridViewportRows = computed(() => (isMobile.value ? 8 : 10))
const gridHeightPx = computed(() => gridHeaderHeight.value + gridRowHeight.value * gridViewportRows.value + 2)
const gridStyle = computed(() => ({ width: '100%', height: `${gridHeightPx.value}px` }))

// Sorting
const gridApi = ref(null)

const gridOptions = {
    // We are using CSS-file themes (ag-grid.css + ag-theme-alpine.css)
    // so we must opt into legacy theming mode in AG Grid v33+.
    theme: 'legacy',
}

const defaultColDef = {
    sortable: true,
    resizable: true,
    minWidth: 80,
}

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => {
    if (gridApi.value?.paginationGetTotalPages) {
        return gridApi.value.paginationGetTotalPages() || 1
    }
    return Math.max(1, Math.ceil(rowData.value.length / itemsPerPage.value))
})

const formatIsoShort = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '—'
    return d.toISOString().slice(0, 16).replace('T', ' ')
}

const normalizeTimestampToUtc = (value) => {
    if (!value) return null
    const raw = String(value).trim()
    if (!raw) return null

    // If timezone is present (Z or +/-hh:mm), keep as-is.
    const hasTimezone = /Z$|[+-]\d{2}:?\d{2}$/.test(raw)
    if (hasTimezone) return raw

    // If server omits timezone (common for UTC timestamps), treat it as UTC.
    // Also normalize "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss".
    const normalized = raw.includes(' ') ? raw.replace(' ', 'T') : raw
    return `${normalized}Z`
}

const formatAttemptDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(normalizeTimestampToUtc(iso) || iso)
    if (Number.isNaN(d.getTime())) return '—'
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = months[d.getMonth()] || ''
    const yyyy = d.getFullYear()
    return `${dd}-${mm}-${yyyy}`
}

const formatAttemptTime = (iso) => {
    if (!iso) return '—'
    const d = new Date(normalizeTimestampToUtc(iso) || iso)
    if (Number.isNaN(d.getTime())) return '—'
    const hh = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    const ms = String(d.getMilliseconds()).padStart(3, '0')
    return `${hh}:${mi}:${ss}.${ms}`
}

const evolutionCellRenderer = (params) => {
    const span = document.createElement('span')
    span.className = `evolution-value ${getRankChangeClass(params.value)}`
    span.textContent = formatRankChange(params.value)
    return span
}

const participantCellRenderer = (params) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'ag-participant-btn'
    btn.textContent = params.value || 'Anonymous'
    btn.onclick = () => {
        const ctx = params?.context
        if (ctx?.showParticipantDetail) {
            ctx.showParticipantDetail(params.value || 'Anonymous', params.data?.participant_id)
        }
    }
    return btn
}

const lastAttemptCellRenderer = (params) => {
    const iso = params.value

    const outer = document.createElement('div')
    outer.className = 'last-attempt-cell'

    const wrap = document.createElement('div')
    wrap.className = 'last-attempt-wrapper'

    const info = document.createElement('div')
    info.className = 'last-attempt-info'

    const date = document.createElement('span')
    date.className = 'attempt-date'
    date.textContent = formatAttemptDate(iso)

    const time = document.createElement('span')
    time.className = 'attempt-time'
    time.textContent = formatAttemptTime(iso)

    info.appendChild(date)
    info.appendChild(time)
    wrap.appendChild(info)
    outer.appendChild(wrap)
    return outer
}

const columnDefs = computed(() => {
    const cols = [
        {
            field: 'rank',
            headerName: 'Rank',
            width: isMobile.value ? 58 : 80,
            pinned: false,
            sort: 'asc',
            cellClass: (p) => (p?.value <= 3 ? 'ag-rank ag-rank-top' : 'ag-rank'),
        },
        {
            field: 'evolution',
            headerName: 'Changes',
            width: isMobile.value ? 70 : 90,
            sortable: true,
            cellRenderer: evolutionCellRenderer,
        },
        {
            field: 'participant_alias',
            headerName: 'Participant',
            minWidth: isMobile.value ? 120 : 180,
            flex: 2,
            sortable: true,
            cellRenderer: participantCellRenderer,
        },
        {
            field: 'best_score',
            headerName: 'Best Score',
            width: isMobile.value ? 92 : 120,
            sortable: true,
            valueFormatter: (p) => Number.isFinite(Number(p.value)) ? Number(p.value).toFixed(1) : '0.0',
            cellClass: 'ag-score',
        },
        {
            field: 'best_time_ms',
            headerName: 'Best Time',
            width: 130,
            sortable: true,
            cellClass: 'ag-time',
        },
        {
            field: 'attempts_count',
            headerName: 'Attempts',
            width: 100,
            sortable: true,
            valueFormatter: (p) => `${parseInt(p.value || 0, 10)}x`,
            cellClass: 'ag-attempts',
        },
        {
            field: 'last_attempt_at',
            headerName: 'Last Attempt',
            minWidth: 170,
            flex: 1,
            sortable: true,
            cellRenderer: lastAttemptCellRenderer,
            cellClass: 'ag-last',
        },
    ]

    if (isMobile.value) {
        return cols.filter(c => ['rank', 'evolution', 'participant_alias', 'best_score'].includes(c.field))
    }
    if (isTablet.value) {
        return cols.filter(c => c.field !== 'last_attempt_at')
    }

    return cols
})

const onGridReady = (params) => {
    gridApi.value = params.api
    params.api.paginationGoToFirstPage()
}

const onPaginationChanged = () => {
    if (!gridApi.value?.paginationGetCurrentPage) return
    currentPage.value = (gridApi.value.paginationGetCurrentPage() || 0) + 1
}

const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages.value))
    if (!gridApi.value?.paginationGoToPage) {
        currentPage.value = p
        return
    }
    gridApi.value.paginationGoToPage(p - 1)
}

const showParticipantDetail = (alias, id) => {
    selectedParticipant.value = { alias, id }
    showParticipantModal.value = true
    copied.value = false
}

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch (err) {
        console.error('Failed to copy:', err)
    }
}

// Helper function to get rank class based on rank number
const getRankClass = (rank) => {
    if (rank === 1) return 'rank-first'
    if (rank === 2) return 'rank-second'
    if (rank === 3) return 'rank-third'
    return 'rank-default'
}

// Helper function to format milliseconds to HH:MM:SS
const formatMillisecondsToTime = (ms) => {
    const totalSeconds = ms / 1000
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const hoursStr = String(hours).padStart(2, '0')
    const minutesStr = String(minutes).padStart(2, '0')
    const secondsStr = seconds.toFixed(4).padStart(7, '0')

    return `${hoursStr}:${minutesStr}:${secondsStr}`
}

const formatRankChange = (change) => {
    const n = Number(change)
    if (!Number.isFinite(n) || n === 0) return '—'
    return `${n > 0 ? '+' : ''}${n}`
}

const getRankChangeClass = (change) => {
    const n = Number(change)
    if (!Number.isFinite(n) || n === 0) return 'evolution-same'
    return n > 0 ? 'evolution-up' : 'evolution-down'
}

const fetchLeaderboard = async (isAutoRefresh = false) => {
    // Prevent rapid multiple requests
    if (loading.value) return

    // Don't show loading spinner on auto-refresh to avoid UI flicker
    if (!isAutoRefresh) {
        loading.value = true
    }
    error.value = null

    const fetcher = props.publicMode ? getPublicQuizLeaderboard : getQuizLeaderboard
    const result = await fetcher(String(props.quizId), {
        rank: selectedRank.value
    })

    if (result.success) {
        const newData = result.data.data.results.map((item, index) => {
            const ms = parseInt(item.best_time_ms || item.BEST_TIME_MS || 0)
            const totalSeconds = Math.floor(ms / 1000)
            const hours = Math.floor(totalSeconds / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60
            const formattedTime = String(hours).padStart(2, '0') + ':' +
                String(minutes).padStart(2, '0') + ':' +
                String(seconds).padStart(2, '0')

            const lastAttempt = item.last_attempt_at || item.LAST_ATTEMPT_AT || null

            const participantId = item.participant_id || item.PARTICIPANT_ID || ''
            const rank = parseInt(item.rank ?? item.RANK ?? (index + 1), 10)
            const rankChange = parseInt(item.rank_change ?? item.RANK_CHANGE ?? 0, 10)
            const previousRank = parseInt(item.previous_rank ?? item.PREVIOUS_RANK ?? 0, 10)

            return {
                rank,
                participant_alias: item.participant_alias || item.PARTICIPANT_ALIAS || 'Anonymous',
                participant_id: participantId,
                best_score: parseFloat(item.best_score || item.BEST_SCORE || 0),
                best_time_ms: formattedTime,
                best_time_ms_raw: ms,
                attempts_count: parseInt(item.attempts_count || item.ATTEMPTS_COUNT || item.TEMPTS_COL || 0),
                last_attempt_at: lastAttempt,
                evolution: rankChange,
                previous_rank: Number.isFinite(previousRank) ? previousRank : 0
            }
        })
        rowData.value = newData
        currentPage.value = 1
        if (gridApi.value?.paginationGoToFirstPage) {
            gridApi.value.paginationGoToFirstPage()
        }
    } else {
        error.value = result.error
    }

    loading.value = false
}

const exportData = (format) => {
    if (!rowData.value.length) return

    if (format === 'csv') {
        const headers = ['Rank', 'Participant', 'Participant ID', 'Best Score', 'Best Time', 'Attempts', 'Last Attempt']
        const rows = rowData.value.map(entry => [
            entry.rank,
            entry.participant_alias || 'Anonymous',
            entry.participant_id,
            entry.best_score.toFixed(2),
            formatMillisecondsToTime(entry.best_time_ms_raw),
            entry.attempts_count,
            entry.last_attempt_at
        ])

        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        downloadFile(csv, `leaderboard-quiz-${props.quizId}-${Date.now()}.csv`, 'text/csv')
    }
}

const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
}

// Initial fetch
onMounted(() => {
    updateResponsive()
    window.addEventListener('resize', updateResponsive)

    // Then fetch current leaderboard
    fetchLeaderboard()

    // Clean up on unmount
    onUnmounted(() => {
        window.removeEventListener('resize', updateResponsive)
    })
})

// Watch for rank selection changes
watch(selectedRank, () => {
    // Fetch new data
    fetchLeaderboard()
})

watch(itemsPerPage, () => {
    currentPage.value = 1
    if (gridApi.value?.paginationSetPageSize) {
        gridApi.value.paginationSetPageSize(itemsPerPage.value)
    }
    if (gridApi.value?.paginationGoToFirstPage) {
        gridApi.value.paginationGoToFirstPage()
    }
})

// Watch for quizId changes
watch(() => props.quizId, () => {
    rowData.value = []
    fetchLeaderboard()
})

// Reset to page 1 when items per page changes
watch(itemsPerPage, () => {
    currentPage.value = 1
})
</script>

<style scoped>
/* Podium Styles */
.podium-container {
    background: linear-gradient(135deg,
            var(--color-gh-card) 0%,
            color-mix(in srgb, var(--color-gh-muted) 8%, var(--color-gh-card)) 50%,
            color-mix(in srgb, var(--color-gh-muted) 12%, var(--color-gh-card)) 100%);
    border: 2px solid color-mix(in srgb, var(--color-gh-muted) 20%, var(--color-gh-border));
    border-radius: 1.5rem;
    padding: 3rem 2rem;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
    box-shadow:
        0 20px 60px color-mix(in srgb, var(--color-gh-muted) 8%, transparent),
        inset 0 1px 0 color-mix(in srgb, var(--color-gh-muted) 15%, transparent);
}

.podium-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
        radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--color-gh-muted) 8%, transparent) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--color-gh-muted) 8%, transparent) 0%, transparent 50%);
    opacity: 1;
    pointer-events: none;
}

.podium-container::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: repeating-linear-gradient(0deg,
            transparent,
            transparent 2px,
            color-mix(in srgb, var(--color-gh-muted) 2%, transparent) 2px,
            color-mix(in srgb, var(--color-gh-muted) 2%, transparent) 4px);
    animation: grid-move 20s linear infinite;
    pointer-events: none;
    opacity: 0.3;
}

@keyframes grid-move {
    0% {
        transform: translate(0, 0);
    }

    100% {
        transform: translate(50px, 50px);
    }
}

.podium-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.podium-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    animation: podium-enter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.podium-1 {
    order: 2;
    animation-delay: 0.2s;
}

.podium-2 {
    order: 1;
    margin-top: 2.5rem;
    animation-delay: 0s;
}

.podium-3 {
    order: 3;
    margin-top: 4rem;
    animation-delay: 0.1s;
}

@keyframes podium-enter {
    0% {
        opacity: 0;
        transform: translateY(40px) scale(0.8);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.podium-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.podium-item .profile-avatar {
    width: 90px;
    height: 90px;
    font-size: 2.25rem;
    border: 5px solid color-mix(in srgb, var(--color-gh-muted) 60%, var(--color-gh-border));
    box-shadow:
        0 10px 40px color-mix(in srgb, var(--color-gh-muted) 20%, transparent),
        0 0 0 10px color-mix(in srgb, var(--color-gh-muted) 8%, transparent);
    position: relative;
}

.podium-1 .profile-avatar {
    width: 110px;
    height: 110px;
    font-size: 2.75rem;
    border-width: 6px;
}

.podium-1 .profile-avatar::before {
    content: '👑';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    animation: crown-float 2s ease-in-out infinite;
}

@keyframes crown-float {

    0%,
    100% {
        transform: translateX(-50%) translateY(0);
    }

    50% {
        transform: translateX(-50%) translateY(-5px);
    }
}

.podium-info {
    text-align: center;
}

.podium-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-gh-text);
    margin: 0;
    text-shadow: 0 2px 8px color-mix(in srgb, var(--color-gh-muted) 40%, transparent);
}

.podium-1 .podium-name {
    font-size: 1.375rem;
}

.podium-level {
    font-size: 0.875rem;
    color: var(--color-gh-text-muted);
    margin: 0.5rem 0 0 0;
    font-weight: 600;
    background: color-mix(in srgb, var(--color-gh-muted) 10%, transparent);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    border: 1px solid color-mix(in srgb, var(--color-gh-muted) 25%, transparent);
}

.podium-rank-box {
    width: 100%;
    padding: 0;
    min-height: 120px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    overflow: visible;
}

.podium-rank-box::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 85%;
    height: 100%;
    background: var(--color-gh-card);
    border: 3px solid var(--color-gh-border);
    border-radius: 0.75rem 0.75rem 0 0;
    box-shadow:
        0 -4px 20px color-mix(in srgb, var(--color-gh-muted) 15%, transparent),
        inset 0 2px 0 color-mix(in srgb, var(--color-gh-muted) 20%, transparent);
    transition: all 0.3s ease;
}

.podium-item:hover .podium-rank-box::before {
    transform: translateX(-50%) translateY(-5px);
    box-shadow:
        0 -8px 32px color-mix(in srgb, var(--color-gh-muted) 25%, transparent),
        inset 0 2px 0 color-mix(in srgb, var(--color-gh-muted) 30%, transparent);
}

.podium-1 .podium-rank-box {
    min-height: 180px;
}

.podium-1 .podium-rank-box::before {
    background: linear-gradient(180deg,
            color-mix(in srgb, #f59e0b 20%, var(--color-gh-card)) 0%,
            var(--color-gh-card) 100%);
    border-color: #f59e0b;
    border-width: 4px;
    box-shadow:
        0 -8px 40px color-mix(in srgb, #f59e0b 25%, transparent),
        inset 0 3px 0 color-mix(in srgb, #f59e0b 35%, transparent),
        0 0 0 1px color-mix(in srgb, #f59e0b 15%, transparent);
}

.podium-1 .podium-rank-box::after {
    content: '';
    position: absolute;
    top: -3px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(85% + 8px);
    height: 6px;
    background: linear-gradient(90deg,
            transparent 0%,
            #f59e0b 20%,
            #fbbf24 50%,
            #f59e0b 80%,
            transparent 100%);
    border-radius: 3px;
    animation: gold-shine 2s ease-in-out infinite;
}

@keyframes gold-shine {

    0%,
    100% {
        opacity: 0.6;
    }

    50% {
        opacity: 1;
    }
}

.podium-2 .podium-rank-box {
    min-height: 140px;
}

.podium-2 .podium-rank-box::before {
    background: linear-gradient(180deg,
            color-mix(in srgb, #6b7280 15%, var(--color-gh-card)) 0%,
            var(--color-gh-card) 100%);
    border-color: #9ca3af;
    box-shadow:
        0 -6px 32px color-mix(in srgb, #6b7280 20%, transparent),
        inset 0 2px 0 color-mix(in srgb, #6b7280 25%, transparent);
}

.podium-3 .podium-rank-box {
    min-height: 110px;
}

.podium-3 .podium-rank-box::before {
    background: linear-gradient(180deg,
            color-mix(in srgb, #d97706 12%, var(--color-gh-card)) 0%,
            var(--color-gh-card) 100%);
    border-color: #ea580c;
    box-shadow:
        0 -6px 32px color-mix(in srgb, #d97706 20%, transparent),
        inset 0 2px 0 color-mix(in srgb, #d97706 25%, transparent);
}

.podium-rank-number {
    font-size: 5rem;
    font-weight: 900;
    background: linear-gradient(180deg,
            var(--color-gh-text) 0%,
            var(--color-gh-text-muted) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 8px color-mix(in srgb, var(--color-gh-muted) 30%, transparent));
    position: relative;
    z-index: 2;
    line-height: 1;
    padding-bottom: 1.5rem;
}

.podium-1 .podium-rank-number {
    font-size: 6rem;
    background: linear-gradient(180deg,
            #fbbf24 0%,
            #f59e0b 50%,
            #d97706 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: number-glow 2s ease-in-out infinite;
    filter: drop-shadow(0 4px 16px color-mix(in srgb, #f59e0b 40%, transparent));
}

@keyframes number-glow {

    0%,
    100% {
        filter: drop-shadow(0 4px 16px color-mix(in srgb, #f59e0b 40%, transparent));
    }

    50% {
        filter: drop-shadow(0 6px 24px color-mix(in srgb, #f59e0b 60%, transparent));
    }
}

.podium-2 .podium-rank-number {
    font-size: 4.5rem;
    background: linear-gradient(180deg,
            #9ca3af 0%,
            #6b7280 50%,
            #4b5563 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 3px 12px color-mix(in srgb, #6b7280 35%, transparent));
}

.podium-3 .podium-rank-number {
    font-size: 4rem;
    background: linear-gradient(180deg,
            #fb923c 0%,
            #ea580c 50%,
            #c2410c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 3px 12px color-mix(in srgb, #ea580c 35%, transparent));
}

/* Leaderboard Table Styles */
.leaderboard-wrapper {
    width: 100%;
    overflow: visible;
    -webkit-overflow-scrolling: touch;
    border-radius: 1rem;
}

.leaderboard-container {
    background: var(--color-gh-card);
    border: 2px solid var(--color-gh-border);
    border-radius: 1rem;
    width: 100%;
    min-width: 100%;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--color-gh-muted) color-mix(in srgb, var(--color-gh-border) 30%, transparent);
}

/* Nuxt <ClientOnly> defaults to a <span> wrapper; make it a block so width:100% works. */
:deep(.leaderboard-container > span) {
    display: block;
    width: 100%;
}

.leaderboard-grid {
    width: 100%;
    min-width: 100%;
}

:deep(.leaderboard-grid.ag-theme-alpine) {
    height: 100%;
    width: 100%;
}

:deep(.leaderboard-grid .ag-root-wrapper),
:deep(.leaderboard-grid .ag-root-wrapper-body),
:deep(.leaderboard-grid .ag-root) {
    height: 100%;
    width: 100%;
}

:deep(.leaderboard-grid .ag-body-viewport),
:deep(.leaderboard-grid .ag-center-cols-viewport),
:deep(.leaderboard-grid .ag-header-viewport),
:deep(.leaderboard-grid .ag-center-cols-container),
:deep(.leaderboard-grid .ag-header-container) {
    width: 100% !important;
}

/* AG Grid theming (scoped via :deep so it applies to grid-generated DOM) */
:deep(.leaderboard-grid.ag-theme-alpine) {
    --ag-background-color: var(--color-gh-card);
    --ag-foreground-color: var(--color-gh-text);
    --ag-header-background-color: var(--color-gh-bg);
    --ag-header-foreground-color: var(--color-gh-text);
    --ag-border-color: var(--color-gh-border);
    --ag-row-border-color: color-mix(in srgb, var(--color-gh-border) 70%, transparent);
    --ag-odd-row-background-color: var(--color-gh-card);
    --ag-row-hover-color: color-mix(in srgb, var(--color-gh-muted) 10%, transparent);
    --ag-font-family: inherit;
    --ag-font-size: 14px;
}

:deep(.leaderboard-grid .ag-root-wrapper) {
    border: none;
    background: transparent;
}

:deep(.leaderboard-grid .ag-header) {
    border-bottom: 2px solid var(--color-gh-accent);
}

:deep(.leaderboard-grid .ag-header-cell-label) {
    justify-content: center;
    font-weight: 700;
    font-size: 0.8125rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

:deep(.leaderboard-grid .ag-cell) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.5rem;
    line-height: 1;
}

:deep(.leaderboard-grid .ag-cell.ag-rank) {
    font-weight: 700;
    color: var(--color-gh-text-muted);
}

:deep(.leaderboard-grid .ag-cell.ag-rank-top) {
    color: var(--color-gh-text);
}

:deep(.leaderboard-grid .ag-cell.ag-score) {
    font-weight: 800;
    color: var(--color-gh-accent);
}

:deep(.leaderboard-grid .ag-cell.ag-time) {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

:deep(.leaderboard-grid .ag-cell.ag-attempts) {
    font-weight: 700;
    color: var(--color-gh-text);
}

:deep(.leaderboard-grid .ag-cell.ag-last) {
    font-size: 0.8125rem;
    color: var(--color-gh-text-muted);
}

/* Last Attempt formatting inside AG Grid */
:deep(.leaderboard-grid .last-attempt-cell) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    width: 100%;
    min-width: 0;
}

:deep(.leaderboard-grid .last-attempt-wrapper) {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: color-mix(in srgb, var(--color-gh-bg) 50%, var(--color-gh-card));
    border-radius: 0.5rem;
    border: 1px solid color-mix(in srgb, var(--color-gh-border) 60%, transparent);
    transition: all 0.2s ease;
    min-width: 0;
    max-width: 100%;
}

:deep(.leaderboard-grid .ag-row-hover .last-attempt-wrapper) {
    background: color-mix(in srgb, var(--color-gh-muted) 5%, color-mix(in srgb, var(--color-gh-bg) 50%, var(--color-gh-card)));
    border-color: color-mix(in srgb, var(--color-gh-muted) 20%, var(--color-gh-border));
}

:deep(.leaderboard-grid .last-attempt-info) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

:deep(.leaderboard-grid .attempt-date) {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-gh-text);
    white-space: nowrap;
    letter-spacing: -0.01em;
}

:deep(.leaderboard-grid .attempt-time) {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-gh-text-muted);
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    white-space: nowrap;
    letter-spacing: 0.02em;
}

:deep(.ag-participant-btn) {
    width: 100%;
    min-width: 0;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    color: var(--color-gh-text);
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:deep(.ag-participant-btn:hover) {
    color: var(--color-gh-muted);
}

/* Custom Scrollbar for Webkit browsers */
.leaderboard-container::-webkit-scrollbar {
    height: 10px;
}

.leaderboard-container::-webkit-scrollbar-track {
    background: color-mix(in srgb, var(--color-gh-border) 30%, transparent);
    border-radius: 0.5rem;
    margin: 0 1rem;
}

.leaderboard-container::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, var(--color-gh-muted), color-mix(in srgb, var(--color-gh-muted) 70%, #000));
    border-radius: 0.5rem;
    border: 2px solid color-mix(in srgb, var(--color-gh-border) 30%, transparent);
    transition: all 0.3s ease;
}

.leaderboard-container::-webkit-scrollbar-thumb:hover {
    background: var(--color-gh-muted);
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-gh-muted) 50%, transparent);
}

.leaderboard-header {
    display: grid;
    background: var(--color-gh-bg);
    border-bottom: 2px solid var(--color-gh-accent);
    padding: 0;
    width: 100%;
    min-width: 100%;
}

.leaderboard-row {
    display: grid;
    border-bottom: 1px solid var(--color-gh-border);
    transition: all 0.2s ease;
    width: 100%;
}

.header-cell {
    position: relative;
    display: flex;
    align-items: stretch;
    justify-content: center;
    transition: all 0.2s ease;
    user-select: none;
    border-right: 1px solid var(--color-gh-border);
}

.header-cell:last-child {
    border-right: none;
}

.header-cell-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 0.75rem;
    transition: all 0.2s ease;
}

.header-cell-content:hover {
    background: color-mix(in srgb, var(--color-gh-muted) 10%, transparent);
}

.header-drag-area {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: move;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.resize-handle {
    position: absolute;
    right: -10px;
    top: 0;
    bottom: 0;
    width: 20px;
    cursor: col-resize !important;
    background: transparent;
    z-index: 999;
    transition: all 0.2s;
}

.resize-handle::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 20%;
    bottom: 20%;
    width: 3px;
    background: transparent;
    transform: translateX(-50%);
    transition: background 0.2s;
    border-radius: 2px;
}

.resize-handle:hover::after {
    background: var(--color-gh-accent);
    box-shadow: 0 0 8px var(--color-gh-accent);
}

.resize-handle:active::after {
    background: var(--color-gh-accent);
    box-shadow: 0 0 12px var(--color-gh-accent);
}

.drag-handle {
    width: 16px;
    height: 16px;
    color: var(--color-gh-text-muted);
    opacity: 0;
    transition: opacity 0.2s;
}

.header-cell:hover .drag-handle {
    opacity: 1;
}

.header-label {
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-gh-text);
}

.sort-icon {
    width: 16px;
    height: 16px;
    color: var(--color-gh-accent);
}

.leaderboard-body {
    overflow-y: auto;
    overflow-x: hidden;
    transition: max-height 0.3s ease;
    scrollbar-width: thin;
    scrollbar-color: var(--color-gh-muted) color-mix(in srgb, var(--color-gh-border) 30%, transparent);
}

.leaderboard-body:not(.has-scroll) {
    overflow-y: hidden;
}

.leaderboard-body.has-scroll::-webkit-scrollbar {
    width: 10px;
}

.leaderboard-body.has-scroll::-webkit-scrollbar-track {
    background: color-mix(in srgb, var(--color-gh-border) 30%, transparent);
    border-radius: 0.5rem;
    margin: 0.5rem 0;
}

.leaderboard-body.has-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--color-gh-muted), color-mix(in srgb, var(--color-gh-muted) 70%, #000));
    border-radius: 0.5rem;
    border: 2px solid color-mix(in srgb, var(--color-gh-border) 30%, transparent);
    transition: all 0.3s ease;
}

.leaderboard-body.has-scroll::-webkit-scrollbar-thumb:hover {
    background: var(--color-gh-muted);
    box-shadow: 0 0 10px color-mix(in srgb, var(--color-gh-muted) 50%, transparent);
}

.leaderboard-row {
    transition: all 0.3s ease;
    background: var(--color-gh-card);
    position: relative;
    margin: 0;
    border-left: 3px solid transparent;
}

.leaderboard-row::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(90deg,
            color-mix(in srgb, var(--color-gh-bg) 80%, var(--color-gh-card)) 0%,
            color-mix(in srgb, var(--color-gh-border) 20%, transparent) 100%);
    transition: width 0.3s ease;
    z-index: 0;
}

.leaderboard-row:hover::before {
    width: 100%;
}

.leaderboard-row:hover {
    border-left-color: var(--color-gh-muted);
    background: color-mix(in srgb, var(--color-gh-bg) 90%, var(--color-gh-card));
}

.leaderboard-row.top-three {
    background: linear-gradient(90deg,
            color-mix(in srgb, var(--color-gh-muted) 8%, var(--color-gh-card)) 0%,
            var(--color-gh-card) 100%);
    border-left-color: color-mix(in srgb, var(--color-gh-muted) 50%, transparent);
}

.row-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.5rem;
    border-right: 1px solid color-mix(in srgb, var(--color-gh-border) 50%, transparent);
    min-height: 44px;
    overflow: visible;
    position: relative;
    z-index: 1;
}

.row-cell:last-child {
    border-right: none;
}

/* Rank Cell */
.col-rank {
    padding: 0.5rem 0.5rem !important;
}

.rank-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.rank-display {
    display: flex;
    align-items: center;
    justify-content: center;
}

.rank-number {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-gh-text-muted);
    transition: all 0.2s ease;
}

.leaderboard-row:hover .rank-number {
    color: var(--color-gh-text);
}

.rank-number.rank-top {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-gh-text);
}

/* Participant Cell */
.participant-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.875rem;
    cursor: pointer;
    transition: all 0.3s;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    width: 100%;
    min-width: 0;
    overflow: hidden;
}

.participant-cell:hover {
    background: color-mix(in srgb, var(--color-gh-muted) 10%, transparent);
}

.participant-cell:hover .participant-name {
    color: var(--color-gh-muted);
}

.profile-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: white;
    font-size: 1rem;
    transition: transform 0.2s;
    position: relative;
    flex-shrink: 0;
}

.profile-avatar:hover {
    transform: scale(1.1);
}

.profile-avatar.avatar-top {
    background: linear-gradient(135deg, var(--color-gh-accent), color-mix(in srgb, var(--color-gh-accent) 80%, #000));
    box-shadow: 0 4px 15px color-mix(in srgb, var(--color-gh-accent) 30%, transparent);
}

.profile-avatar.avatar-default {
    background: linear-gradient(135deg, var(--color-gh-accent), color-mix(in srgb, var(--color-gh-accent) 70%, #000));
}

.avatar-text {
    position: relative;
    z-index: 1;
}

.participant-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
    min-width: 0;
}

.participant-name {
    font-weight: 700;
    color: var(--color-gh-text);
    font-size: 1rem;
    transition: color 0.2s;
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    line-height: 1.3;
    text-align: center;
}

.participant-subtitle {
    font-size: 0.75rem;
    color: var(--color-gh-text-muted);
    font-family: 'Courier New', monospace;
    font-weight: 500;
}

/* Score Cell */
.score-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    width: 100%;
    min-width: 0;
}

.score-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
}

.score-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.25rem;
    flex-wrap: wrap;
}

.score-number {
    font-weight: 900;
    color: var(--color-gh-muted);
    font-size: 1.25rem;
    line-height: 1;
}

/* Time Cell */
.time-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    width: 100%;
    min-width: 0;
}

.time-icon {
    width: 18px;
    height: 18px;
    color: var(--color-gh-muted);
}

.time-value {
    font-weight: 700;
    color: var(--color-gh-text);
    font-size: 1.05rem;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
}

/* Attempts Cell */
.attempts-cell {
    display: flex;
    align-items: center;
    justify-content: center;
}

.attempts-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem 0.75rem;
    background: color-mix(in srgb, var(--color-gh-border) 50%, transparent);
    border: 2px solid var(--color-gh-border);
    border-radius: 0.5rem;
    gap: 0.125rem;
}

.attempts-value {
    font-weight: 800;
    color: var(--color-gh-text);
    font-size: 1rem;
}

/* Last Attempt Cell */
.last-attempt-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    width: 100%;
    min-width: 0;
}

.last-attempt-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: color-mix(in srgb, var(--color-gh-bg) 50%, var(--color-gh-card));
    border-radius: 0.5rem;
    border: 1px solid color-mix(in srgb, var(--color-gh-border) 60%, transparent);
    transition: all 0.2s ease;
    min-width: 0;
    max-width: 100%;
}

.leaderboard-row:hover .last-attempt-wrapper {
    background: color-mix(in srgb, var(--color-gh-muted) 5%, color-mix(in srgb, var(--color-gh-bg) 50%, var(--color-gh-card)));
    border-color: color-mix(in srgb, var(--color-gh-muted) 20%, var(--color-gh-border));
}

.last-attempt-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.attempt-date {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-gh-text);
    white-space: nowrap;
    letter-spacing: -0.01em;
}

.attempt-time {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-gh-text-muted);
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    white-space: nowrap;
    letter-spacing: 0.02em;
}

/* Evolution Cell */
.evolution-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
}

:deep(.evolution-value) {
    line-height: 1;
    font-size: 0.85rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
}

:deep(.evolution-up) {
    color: #22C55E;
}

:deep(.evolution-down) {
    color: #EF4444;
}

:deep(.evolution-same) {
    color: var(--color-gh-text-muted);
}

/* Pagination */
.leaderboard-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: var(--color-gh-bg);
    border-top: 1px solid var(--color-gh-border);
}

.pagination-info {
    font-size: 0.875rem;
    color: var(--color-gh-text-muted);
}

.pagination-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.pagination-btn {
    padding: 0.5rem;
    background: var(--color-gh-card);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    color: var(--color-gh-text);
    cursor: pointer;
    transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
    background: var(--color-gh-accent);
    border-color: var(--color-gh-accent);
    color: white;
}

.pagination-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.page-number {
    font-weight: 600;
    color: var(--color-gh-text);
}

.items-per-page {
    padding: 0.5rem;
    background: var(--color-gh-card);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    color: var(--color-gh-text);
    font-size: 0.875rem;
    cursor: pointer;
}

.animate-fade-in {
    animation: fadeIn 0.2s ease-in;
}

.animate-scale-in {
    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Mobile optimizations */
@media (max-width: 767px) {
    .leaderboard-wrapper {
        margin: 0 -1rem;
        width: calc(100% + 2rem);
        border-radius: 0;
    }

    .leaderboard-container {
        border-left: none;
        border-right: none;
        border-radius: 0;
    }

    /* AG Grid (actual table) */
    :deep(.leaderboard-grid.ag-theme-alpine) {
        --ag-font-size: 12px;
    }

    :deep(.leaderboard-grid .ag-header-cell-label) {
        font-size: 0.6875rem;
        letter-spacing: 0.04em;
    }

    :deep(.leaderboard-grid .ag-cell) {
        padding: 0 0.25rem;
    }

    :deep(.leaderboard-grid .ag-cell.ag-last) {
        font-size: 0.75rem;
    }

    :deep(.leaderboard-grid .last-attempt-cell) {
        padding: 0.25rem;
    }

    :deep(.leaderboard-grid .last-attempt-wrapper) {
        gap: 0.5rem;
        padding: 0.5rem 0.5rem;
        border-radius: 0.5rem;
    }

    :deep(.leaderboard-grid .attempt-date) {
        font-size: 0.75rem;
    }

    :deep(.leaderboard-grid .attempt-time) {
        font-size: 0.6875rem;
    }

    .header-label {
        font-size: 0.65rem;
    }

    .row-cell {
        padding: 0.5rem 0.375rem;
        min-height: 40px;
    }

    .participant-cell {
        gap: 0.5rem;
        padding: 0.25rem 0;
    }

    .profile-avatar {
        width: 28px;
        height: 28px;
        font-size: 0.75rem;
    }

    .participant-name {
        font-size: 0.7rem;
    }

    .score-number {
        font-size: 1rem;
    }

    .score-max {
        font-size: 0.7rem;
    }

    .rank-number {
        width: 20px;
        height: 20px;
        font-size: 0.7rem;
    }

    .evolution-symbol {
        width: 20px;
        height: 20px;
    }

    .evolution-icon {
        width: 12px;
        height: 12px;
    }

    .leaderboard-pagination {
        padding: 0.75rem;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .pagination-info {
        font-size: 0.75rem;
    }

    .pagination-btn {
        padding: 0.375rem;
    }

    .podium-container {
        padding: 2rem 1rem;
    }

    .podium-wrapper {
        gap: 1rem;
    }

    .podium-item .profile-avatar {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
    }

    .podium-1 .profile-avatar {
        width: 75px;
        height: 75px;
        font-size: 1.875rem;
    }

    .podium-name {
        font-size: 0.875rem;
    }

    .podium-1 .podium-name {
        font-size: 1rem;
    }

    .podium-level {
        font-size: 0.75rem;
    }

    .podium-rank-box {
        padding: 1rem;
        min-height: 80px;
    }

    .podium-1 .podium-rank-box {
        min-height: 100px;
    }

    .podium-2 .podium-rank-box {
        min-height: 75px;
    }

    .podium-3 .podium-rank-box {
        min-height: 70px;
    }

    .podium-rank-number {
        font-size: 2.5rem;
    }

    .podium-1 .podium-rank-number {
        font-size: 3rem;
    }
}

/* Dark Mode - Use blue/accent colors */
@media (prefers-color-scheme: dark) {
    .podium-container {
        background: linear-gradient(135deg,
                var(--color-gh-card) 0%,
                color-mix(in srgb, var(--color-gh-accent) 8%, var(--color-gh-card)) 50%,
                color-mix(in srgb, var(--color-gh-accent) 12%, var(--color-gh-card)) 100%);
        border: 2px solid color-mix(in srgb, var(--color-gh-accent) 20%, var(--color-gh-border));
        box-shadow:
            0 20px 60px color-mix(in srgb, var(--color-gh-accent) 8%, transparent),
            inset 0 1px 0 color-mix(in srgb, var(--color-gh-accent) 15%, transparent);
    }

    .podium-container::before {
        background:
            radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--color-gh-accent) 8%, transparent) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, color-mix(in srgb, var(--color-gh-accent) 8%, transparent) 0%, transparent 50%);
    }

    .podium-container::after {
        background: repeating-linear-gradient(0deg,
                transparent,
                transparent 2px,
                color-mix(in srgb, var(--color-gh-accent) 2%, transparent) 2px,
                color-mix(in srgb, var(--color-gh-accent) 2%, transparent) 4px);
    }

    .podium-rank-box::before {
        box-shadow:
            0 -4px 20px color-mix(in srgb, var(--color-gh-accent) 15%, transparent),
            inset 0 2px 0 color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
    }

    .podium-item:hover .podium-rank-box::before {
        box-shadow:
            0 -8px 32px color-mix(in srgb, var(--color-gh-accent) 25%, transparent),
            inset 0 2px 0 color-mix(in srgb, var(--color-gh-accent) 30%, transparent);
    }

    .podium-item .profile-avatar {
        border: 5px solid color-mix(in srgb, var(--color-gh-accent) 60%, var(--color-gh-border));
        box-shadow:
            0 10px 40px color-mix(in srgb, var(--color-gh-accent) 20%, transparent),
            0 0 0 10px color-mix(in srgb, var(--color-gh-accent) 8%, transparent);
    }

    .podium-name {
        text-shadow: 0 2px 8px color-mix(in srgb, var(--color-gh-accent) 40%, transparent);
    }

    .podium-level {
        background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
        border: 1px solid color-mix(in srgb, var(--color-gh-accent) 25%, transparent);
    }

    .podium-rank-number {
        filter: drop-shadow(0 2px 8px color-mix(in srgb, var(--color-gh-accent) 30%, transparent));
    }

    .header-cell-content:hover {
        background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    }

    .leaderboard-container {
        scrollbar-color: var(--color-gh-accent) color-mix(in srgb, var(--color-gh-border) 30%, transparent);
    }

    .leaderboard-container::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, var(--color-gh-accent), color-mix(in srgb, var(--color-gh-accent) 70%, #000));
    }

    .leaderboard-container::-webkit-scrollbar-thumb:hover {
        background: var(--color-gh-accent);
        box-shadow: 0 0 10px color-mix(in srgb, var(--color-gh-accent) 50%, transparent);
    }

    .leaderboard-body {
        scrollbar-color: var(--color-gh-accent) color-mix(in srgb, var(--color-gh-border) 30%, transparent);
    }

    .leaderboard-body.has-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, var(--color-gh-accent), color-mix(in srgb, var(--color-gh-accent) 70%, #000));
    }

    .leaderboard-body.has-scroll::-webkit-scrollbar-thumb:hover {
        background: var(--color-gh-accent);
        box-shadow: 0 0 10px color-mix(in srgb, var(--color-gh-accent) 50%, transparent);
    }

    .leaderboard-row:hover {
        border-left-color: var(--color-gh-accent);
    }

    .leaderboard-row.top-three {
        background: linear-gradient(90deg,
                color-mix(in srgb, var(--color-gh-accent) 8%, var(--color-gh-card)) 0%,
                var(--color-gh-card) 100%);
        border-left-color: color-mix(in srgb, var(--color-gh-accent) 50%, transparent);
    }

    .participant-cell:hover {
        background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    }

    .participant-cell:hover .participant-name {
        color: var(--color-gh-accent);
    }

    .score-number {
        color: var(--color-gh-accent);
    }

    .time-icon {
        color: var(--color-gh-accent);
    }

    .last-attempt-wrapper:hover {
        background: color-mix(in srgb, var(--color-gh-accent) 5%, color-mix(in srgb, var(--color-gh-bg) 50%, var(--color-gh-card)));
        border-color: color-mix(in srgb, var(--color-gh-accent) 20%, var(--color-gh-border));
    }
}

/* Light Mode - Use gray/dark colors */
[data-theme="light"] {
    .podium-container {
        background: linear-gradient(135deg,
                var(--color-gh-card) 0%,
                color-mix(in srgb, #1f2937 5%, var(--color-gh-card)) 50%,
                color-mix(in srgb, #374151 8%, var(--color-gh-card)) 100%);
        border: 2px solid color-mix(in srgb, #6b7280 30%, var(--color-gh-border));
        box-shadow:
            0 20px 60px color-mix(in srgb, #111827 8%, transparent),
            inset 0 1px 0 color-mix(in srgb, #9ca3af 15%, transparent);
    }

    .podium-container::before {
        background:
            radial-gradient(circle at 20% 30%, color-mix(in srgb, #374151 6%, transparent) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, color-mix(in srgb, #374151 6%, transparent) 0%, transparent 50%);
    }

    .podium-container::after {
        background: repeating-linear-gradient(0deg,
                transparent,
                transparent 2px,
                color-mix(in srgb, #d1d5db 3%, transparent) 2px,
                color-mix(in srgb, #d1d5db 3%, transparent) 4px);
    }

    .podium-rank-box::before {
        box-shadow:
            0 -4px 20px color-mix(in srgb, #6b7280 12%, transparent),
            inset 0 2px 0 color-mix(in srgb, #9ca3af 15%, transparent);
    }

    .podium-item:hover .podium-rank-box::before {
        box-shadow:
            0 -8px 32px color-mix(in srgb, #6b7280 20%, transparent),
            inset 0 2px 0 color-mix(in srgb, #9ca3af 25%, transparent);
    }

    .podium-item .profile-avatar {
        border: 5px solid color-mix(in srgb, #6b7280 50%, var(--color-gh-border));
        box-shadow:
            0 10px 40px color-mix(in srgb, #374151 15%, transparent),
            0 0 0 10px color-mix(in srgb, #d1d5db 10%, transparent);
    }

    .podium-name {
        text-shadow: 0 2px 8px color-mix(in srgb, #374151 25%, transparent);
    }

    .podium-level {
        background: color-mix(in srgb, #f3f4f6 80%, transparent);
        border: 1px solid color-mix(in srgb, #d1d5db 40%, transparent);
    }

    .podium-rank-number {
        filter: drop-shadow(0 2px 8px color-mix(in srgb, #374151 20%, transparent));
    }

    .header-cell-content:hover {
        background: color-mix(in srgb, #f3f4f6 60%, transparent);
    }

    .leaderboard-container {
        scrollbar-color: #9ca3af color-mix(in srgb, var(--color-gh-border) 30%, transparent);
    }

    .leaderboard-container::-webkit-scrollbar-thumb {
        background: linear-gradient(90deg, #9ca3af, color-mix(in srgb, #6b7280 80%, #fff));
    }

    .leaderboard-container::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
        box-shadow: 0 0 10px color-mix(in srgb, #374151 30%, transparent);
    }

    .leaderboard-body {
        scrollbar-color: #9ca3af color-mix(in srgb, var(--color-gh-border) 30%, transparent);
    }

    .leaderboard-body.has-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #9ca3af, color-mix(in srgb, #6b7280 80%, #fff));
    }

    .leaderboard-body.has-scroll::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
        box-shadow: 0 0 10px color-mix(in srgb, #374151 30%, transparent);
    }

    .leaderboard-row:hover {
        border-left-color: #6b7280;
    }

    .leaderboard-row.top-three {
        background: linear-gradient(90deg,
                color-mix(in srgb, #f3f4f6 60%, var(--color-gh-card)) 0%,
                var(--color-gh-card) 100%);
        border-left-color: color-mix(in srgb, #9ca3af 40%, transparent);
    }

    .participant-cell:hover {
        background: color-mix(in srgb, #f9fafb 70%, transparent);
    }

    .participant-cell:hover .participant-name {
        color: #1f2937;
    }

    .score-number {
        color: #374151;
    }

    .time-icon {
        color: #6b7280;
    }

    .last-attempt-wrapper:hover {
        background: color-mix(in srgb, #f9fafb 60%, var(--color-gh-card));
        border-color: color-mix(in srgb, #d1d5db 50%, var(--color-gh-border));
    }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1023px) {
    .header-label {
        font-size: 0.7rem;
    }

    .row-cell {
        padding: 0.625rem 0.5rem;
    }

    .participant-name {
        font-size: 0.8rem;
    }

    .score-number {
        font-size: 1.5rem;
    }
}

/* Smooth scrollbar for desktop */
@media (min-width: 1024px) {
    /* Desktop-specific overrides can go here */
}
</style>
