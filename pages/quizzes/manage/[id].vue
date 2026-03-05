<template>
  <div class="max-w-[1920px] mx-auto px-4 py-8">
    <!-- Decorative Background -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute top-0 right-0 w-[500px] h-[500px] bg-gh-accent/5 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="relative z-10 flex items-center justify-center py-20">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"
      ></div>
    </div>

    <!-- Main Content -->
    <div v-else-if="quiz" class="relative z-10">
      <!-- Hero Header -->
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gh-text-muted mb-4">
          <NuxtLink to="/quizzes" class="hover:text-gh-accent transition-colors">
            Quizzes
          </NuxtLink>
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span class="text-gh-text font-medium">Manage Questions</span>
        </div>

        <div
          class="flex flex-col md:flex-row md:items-start justify-between gap-6"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-16 h-16 rounded-2xl bg-gradient-to-br from-gh-accent to-blue-600 flex items-center justify-center shadow-lg shadow-gh-accent/20"
            >
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gh-text mb-2">
                {{ quiz.title }}
              </h1>
              <div class="flex items-center gap-4 text-sm text-gh-text-muted">
                <span class="flex items-center gap-1">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  {{ currentQuestions.length }} Questions
                </span>
                <span
                  class="flex items-center gap-1"
                  :class="
                    totalPoints > 100 ? 'text-orange-400' : 'text-gh-text-muted'
                  "
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {{ totalPoints }} Points
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Button
              variant="secondary"
              @click="handleRefresh"
              :disabled="syncing"
              class="bg-gh-card border-gh-border hover:bg-gh-bg-secondary"
            >
              <svg
                class="w-4 h-4 mr-2"
                :class="{ 'animate-spin': syncing }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </Button>
            <Button
              @click="handleSync"
              :disabled="syncing || !hasChanges"
              class="min-w-[140px]"
            >
              <svg
                v-if="!syncing"
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <svg
                v-else
                class="w-4 h-4 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ syncing ? "Saving..." : "Save Changes" }}
            </Button>
          </div>
        </div>
      </div>

      <Alert v-if="syncError" variant="error" class="mb-6">
        {{ syncError }}
      </Alert>

      <Alert v-if="syncSuccess" variant="success" class="mb-6">
        Changes saved successfully!
      </Alert>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Pane: Timeline Workspace -->
        <div class="lg:col-span-1 relative flex flex-col h-[calc(100vh-200px)]">
           <!-- Timeline Header -->
           <div class="flex items-center justify-between mb-4 px-2">
              <h2 class="text-lg font-bold text-gh-text flex items-center gap-2">
                Quiz Timeline
                <span class="text-xs font-normal text-gh-text-muted bg-gh-bg-secondary px-2 py-0.5 rounded-full">
                  {{ currentQuestions.length }} Questions
                </span>
              </h2>
           </div>

           <!-- Timeline Container -->
           <div 
             class="flex-1 overflow-y-auto pr-2"
             ref="currentQuestionsDropZone"
             @drop="handleDrop($event, 'current')"
             @dragover.prevent="handleDragOverZone($event, 'current')"
             @dragenter="handleDragEnter('current')"
             @dragleave="handleDragLeave('current')"
           >
             <div class="relative min-h-full">
               <!-- Empty State -->
               <div v-if="currentQuestions.length === 0" class="flex flex-col items-center justify-center h-40 text-gh-text-muted relative z-10 pl-12">
                  <div class="w-10 h-10 rounded-full border-2 border-dashed border-gh-border flex items-center justify-center mb-2 z-10 bg-gh-bg">
                     <span class="text-xl">+</span>
                  </div>
                  <p class="text-sm">Start building your quiz</p>
               </div>

               <!-- Question Nodes -->
               <div class="pb-32"> <!-- Padding bottom for trash zone -->
                   <div
                     v-for="(question, index) in currentQuestions"
                     :key="question.id"
                     draggable="true"
                     @dragstart="handleDragStart($event, question, 'current', index)"
                     @dragend="handleDragEnd"
                     @dragover.prevent="handleDragOverChild($event, 'current', index)"
                     @drop="handleDropOnChild($event, 'current', index)"
                     :id="`current-question-${question.id}`"
                     class="relative z-10 pl-12 pb-4 group cursor-move"
                   >
                      <!-- Top Line Segment (Connect to previous) -->
                      <div v-if="index > 0" class="absolute left-6 top-0 h-1/2 w-0.5 bg-gh-border z-0"></div>
                      
                      <!-- Bottom Line Segment (Connect to next) -->
                      <div v-if="index < currentQuestions.length - 1" class="absolute left-6 top-1/2 bottom-[-16px] w-0.5 bg-gh-border z-0"></div>

                      <!-- Timeline Node -->
                      <div class="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gh-bg border-2 border-gh-accent flex items-center justify-center z-20 shadow-sm transform -mt-2">
                         <span class="text-[10px] font-bold text-gh-accent">{{ index + 1 }}</span>
                      </div>

                      <!-- Question Card (Soft UI) -->
                      <div class="bg-gh-bg rounded-xl p-3 shadow-sm border border-transparent hover:border-gh-border hover:shadow-md transition-all">
                         <div class="flex items-center justify-between mb-1">
                            <h3 class="text-sm font-semibold text-gh-text truncate pr-2">
                               {{ question.question_title }}
                            </h3>
                            <button
                              @click="moveToAvailableQuestions(question)"
                              class="lg:hidden text-gh-text-muted hover:text-red-400"
                            >
                               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                               </svg>
                            </button>
                         </div>
                         <div class="flex items-center gap-3 text-xs text-gh-text-muted">
                            <span class="px-1.5 py-0.5 rounded bg-gh-bg-secondary">{{ getQuestionTypeLabel(question.question_type) }}</span>
                            <span>{{ question.points }} pts</span>
                         </div>
                      </div>
                   </div>
               </div>
             </div>
           </div>

           <!-- Dynamic Trash Zone (Slide Up) -->
           <div 
             class="absolute bottom-4 left-4 right-6 z-30 transition-all duration-300 ease-in-out transform"
             :class="[
               isDraggingCurrent ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
             ]"
           >
              <div
                ref="toRemoveDropZone"
                @drop="handleDrop($event, 'remove')"
                @dragover.prevent
                @dragenter.prevent="handleDragEnter('remove')"
                @dragleave="handleDragLeave('remove')"
                class="bg-red-500 text-white rounded-xl p-6 shadow-xl flex flex-col items-center justify-center border-2 border-transparent transition-colors"
                :class="{ 'border-white bg-red-600 scale-105': dragOverZone === 'remove' }"
              >
                 <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                 </svg>
                 <span class="font-bold">Drop here to remove</span>
              </div>
           </div>

           <!-- To Remove List (Hidden / Drawer / or Bottom Section if items exist) -->
           <!-- Only show if there are items to restore, as a small list at bottom if not dragging -->
           <div v-if="toRemoveQuestions.length > 0" :class="{ 'invisible': isDraggingCurrent }" class="mt-4 border-t border-gh-border pt-4">
              <h3 class="text-xs font-bold text-gh-text-muted uppercase mb-2">Marked for Removal</h3>
              <div class="space-y-2 max-h-40 overflow-y-auto pr-2">
                 <div v-for="question in toRemoveQuestions" :key="question.id" class="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                    <span class="text-xs text-red-500 line-through truncate flex-1">{{ question.question_title }}</span>
                    <button @click="restoreToCurrent(question)" class="text-gh-text-muted hover:text-gh-accent">
                       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                       </svg>
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <!-- Right Pane: Available Questions -->
        <div class="lg:col-span-2">
          <div class="bg-gh-card border border-gh-border rounded-xl shadow-sm h-[calc(100vh-200px)] flex flex-col lg:sticky lg:top-6">
            <div class="p-4 border-b border-gh-border bg-gh-bg-secondary/80 backdrop-blur-md space-y-4 rounded-t-xl z-10">
               <div class="flex items-center justify-between">
                  <h2 class="font-bold text-gh-text flex items-center gap-2">
                    <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Question Library
                  </h2>
               </div>

              <!-- Compact Toolbar -->
              <div class="flex flex-col xl:flex-row gap-3">
                 <div class="flex-1 relative min-w-[250px]">
                    <SearchInput
                      v-model="searchQuery"
                      placeholder="Search..."
                      class="w-full !h-10"
                    />
                 </div>
                
                <div class="grid grid-cols-3 gap-2 text-sm">
                  <FilterSelect 
                    v-model="filterCategory" 
                    :options="questionInfo.categories"
                    placeholder="Category"
                    class="min-w-0"
                  />
                  <FilterSelect 
                    v-model="filterType" 
                    :options="questionTypes"
                    placeholder="Type"
                    class="min-w-0"
                  />
                  <FilterSelect 
                    v-model="filterDifficulty" 
                    :options="difficultyLevels"
                    placeholder="Diff"
                    class="min-w-0"
                  />
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div
              v-if="loadingQuestions"
              class="flex-1 flex items-center justify-center"
            >
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-gh-accent"
              ></div>
            </div>

            <!-- Questions List -->
            <div
              v-else
              ref="availableQuestionsZone"
              class="flex-1 overflow-y-auto p-4 space-y-3 resize-y bg-gh-bg-secondary/30"
              @drop="handleDrop($event, 'available')"
              @dragover.prevent
              @dragenter.prevent="handleDragEnter('available')"
              @dragleave="handleDragLeave('available')"
            >
               <div
                v-for="question in filteredAvailableQuestions"
                :key="question.id"
                :draggable="!isQuestionInCurrentOrRemove(question.id)"
                @dragstart="handleDragStart($event, question, 'available')"
                @dragend="handleDragEnd"
                :class="[
                  'group relative flex items-start gap-4 p-4 rounded-xl border transition-all',
                  isQuestionInCurrentOrRemove(question.id)
                    ? 'bg-gh-bg-secondary/50 border-transparent opacity-60'
                    : 'bg-gh-bg border-transparent shadow-sm hover:shadow-md hover:border-gh-border cursor-move',
                ]"
              >
                 <!-- Status / Drag Handle -->
                 <div class="mt-1">
                    <div v-if="isQuestionInCurrentOrRemove(question.id)" class="text-green-500 bg-green-500/10 p-1 rounded-full">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div v-else class="text-gh-text-muted group-hover:text-gh-accent p-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                 </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1.5">
                     <span class="text-[10px] uppercase font-bold tracking-wider text-gh-text-muted">
                      {{ getQuestionTypeLabel(question.question_type) }}
                    </span>
                    <span class="w-1 h-1 rounded-full bg-gh-border"></span>
                    <span 
                        class="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        :class="getDifficultyClass(question.difficulty_level)"
                    >
                        {{ question.difficulty_level }}
                    </span>
                  </div>
                  
                  <p class="text-gh-text font-semibold line-clamp-2 leading-tight">
                    {{ question.question_title }}
                  </p>
                  
                  <div class="flex items-center gap-4 mt-2 text-xs text-gh-text-muted">
                    <span class="flex items-center gap-1">
                       <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                       </svg>
                       {{ question.category }}
                    </span>
                    <span class="flex items-center gap-1 font-mono text-gh-accent">
                       <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                       {{ question.points }} pts
                    </span>
                  </div>
                </div>

                 <!-- Add Action Button -->
                 <button
                   v-if="!isQuestionInCurrentOrRemove(question.id)"
                   @click="moveToRemove(question)"
                   class="self-center p-2 text-gh-text-muted hover:text-gh-accent hover:bg-gh-accent/10 rounded-lg transition-colors"
                   title="Add to quiz"
                 >
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                   </svg>
                 </button>
              </div>

              <div
                v-if="filteredAvailableQuestions.length === 0"
                class="flex flex-col items-center justify-center py-20 text-gh-text-muted"
              >
                <div class="w-16 h-16 bg-gh-bg-secondary rounded-full flex items-center justify-center mb-4 opacity-50">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <p class="font-medium">No questions found</p>
                <p class="text-sm mt-1">Try adjusting your filters</p>
              </div>
            </div>

            <!-- Footer / Pagination -->
            <div
              v-if="totalPages > 1"
              class="p-4 border-t border-gh-border bg-gh-bg-secondary/30 flex justify-between items-center"
            >
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-4 py-2 bg-gh-bg border border-gh-border rounded-lg text-gh-text disabled:opacity-50 disabled:cursor-not-allowed hover:border-gh-accent text-sm font-medium transition-all shadow-sm"
              >
                Previous
              </button>

              <span class="text-gh-text-muted text-xs font-mono bg-gh-bg-secondary px-3 py-1 rounded-full">
                Page {{ currentPage }} / {{ totalPages }}
              </span>

              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-gh-bg border border-gh-border rounded-lg text-gh-text disabled:opacity-50 disabled:cursor-not-allowed hover:border-gh-accent text-sm font-medium transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Hidden Ghost Proxy for Dragging -->
    <div
      ref="dragGhost"
      class="absolute -top-[9999px] left-0 w-[300px] bg-gh-bg rounded-xl p-3 shadow-sm border border-gh-border z-50 pointer-events-none"
    >
       <div class="flex items-center justify-between mb-1">
          <h3 class="ghost-title text-sm font-semibold text-gh-text truncate pr-2">
            {{ ghostTitle }}
          </h3>
       </div>
       <div class="flex items-center gap-3 text-xs text-gh-text-muted">
          <span class="ghost-type px-1.5 py-0.5 rounded bg-gh-bg-secondary">Type</span>
          <span class="ghost-points">0 pts</span>
       </div>
    </div>
  </div>
</template>

<script setup>
import SearchInput from "~/components/ui/SearchInput.vue";
import FilterSelect from "~/components/ui/FilterSelect.vue";
import Button from "~/components/ui/Button.vue";
import Input from "~/components/ui/Input.vue";
import Card from "~/components/ui/Card.vue";
import Alert from "~/components/ui/Alert.vue";
import BackButton from "~/components/ui/BackButton.vue";

definePageMeta({
  middleware: "auth",
});

const router = useRouter();
const route = useRoute();
const { getQuizById, bindQuestions } = useQuizzes();
const { getQuestions, searchQuestions } = useQuestions();
const {
  getQuestionTypeLabel,
  getDifficultyClass,
  questionTypes,
  difficultyLevels,
} = useQuestionEnums();
const { questionInfo, getQuestionInfo } = useQuestionInfo();

// State
const quiz = ref(null);
const loading = ref(true);
const loadError = ref(null);
const loadingQuestions = ref(true);
const syncing = ref(false);
const syncError = ref(null);
const syncSuccess = ref(false);

// Questions state
const currentQuestions = ref([]);
const toRemoveQuestions = ref([]);
const availableQuestions = ref([]);
const originalQuestionIds = ref([]);
const originalQuestionOrder = ref([]);

// Refs for resizable containers
const currentQuestionsDropZone = ref(null);
const toRemoveDropZone = ref(null);
const availableQuestionsZone = ref(null);

// Drag and drop state
const draggedQuestion = ref(null);
const draggedFrom = ref(null);
const draggedIndex = ref(null);
const dragOverZone = ref(null);
const isDraggingCurrent = ref(false);
const dragGhost = ref(null);
const ghostTitle = ref("");

// Search and filters
const searchQuery = ref("");
const filterCategory = ref("");
const filterType = ref("");
const filterDifficulty = ref("");
const currentPage = ref(1);
const perPage = 20;
const isSearchingLibrary = ref(false);
let searchDebounceTimer = null;

// Computed
const totalPoints = computed(() => {
  return currentQuestions.value.reduce((sum, q) => sum + (q.points || 0), 0);
});

const hasChanges = computed(() => {
  const currentIds = currentQuestions.value.map((q) => q.id);
  const originalIds = originalQuestionOrder.value;

  // Check if order or content changed
  const hasOrderOrContentChanges =
    JSON.stringify(currentIds) !== JSON.stringify(originalIds);
  const hasRemovals = toRemoveQuestions.value.length > 0;

  return hasOrderOrContentChanges || hasRemovals;
});

// Server-side pagination - results are already paginated
const filteredAvailableQuestions = computed(() => {
  return availableQuestions.value;
});

const totalPages = ref(1);
const totalItems = ref(0);

// Debounced search that calls the API
const performLibrarySearch = async () => {
  isSearchingLibrary.value = true;
  loadingQuestions.value = true;

  const hasQuery = searchQuery.value && searchQuery.value.trim().length > 0;
  const hasFilters = filterCategory.value || filterDifficulty.value || filterType.value;

  try {
    let results = [];

    if (hasQuery || hasFilters) {
      // Use search API when there's a query or filters
      const searchResult = await searchQuestions({
        q: searchQuery.value || undefined,
        category: filterCategory.value || undefined,
        difficulty_level: filterDifficulty.value || undefined,
        question_type: filterType.value || undefined,
        page: currentPage.value,
        per_page: perPage,
      });

      if (searchResult.success && searchResult.data) {
        results = searchResult.data.data?.results || [];
        const pagination = searchResult.data.data?.pagination;
        if (pagination) {
          totalPages.value = pagination.totalPages;
          totalItems.value = pagination.totalItems;
        }
        // Map the search results to match the expected question format
        availableQuestions.value = results.map((item) => ({
          id: item.question_id || item.id,
          question_title: item.title || item.question_title,
          question_text: item.question_text || '',
          category: item.category,
          difficulty_level: item.difficulty_level,
          question_type: item.question_type,
          points: item.points || 0,
          is_public: item.is_public || false,
        }));
      } else {
        console.error('Search failed:', searchResult.error);
        availableQuestions.value = [];
        totalPages.value = 1;
        totalItems.value = 0;
      }
    } else {
      // Use getQuestions API for initial load without filters
      const listResult = await getQuestions({
        page: currentPage.value,
        per_page: perPage,
      });

      if (listResult.success && listResult.data) {
        availableQuestions.value = listResult.data.data?.results || [];
        const pagination = listResult.data.data?.pagination;
        if (pagination) {
          totalPages.value = pagination.totalPages;
          totalItems.value = pagination.totalItems;
        }
      } else {
        console.error('Failed to fetch questions:', listResult.error);
        availableQuestions.value = [];
        totalPages.value = 1;
        totalItems.value = 0;
      }
    }
  } catch (error) {
    console.error('Library search error:', error);
    availableQuestions.value = [];
  } finally {
    isSearchingLibrary.value = false;
    loadingQuestions.value = false;
  }
};

// Watch filters and search query for changes - debounced API call
watch(
  [searchQuery, filterCategory, filterType, filterDifficulty],
  () => {
    currentPage.value = 1; // Reset to first page on filter change
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    searchDebounceTimer = setTimeout(() => {
      performLibrarySearch();
    }, 300);
  }
);

// Watch page changes to re-fetch from server
watch(currentPage, () => {
  performLibrarySearch();
});

// Methods
const isQuestionInCurrentOrRemove = (questionId) => {
  return (
    currentQuestions.value.some((q) => q.id === questionId) ||
    toRemoveQuestions.value.some((q) => q.id === questionId)
  );
};

const handleDragStart = (event, question, fromZone, index = null) => {
  // Guard: Don't allow dragging if disabled
  if (fromZone === "available" && isQuestionInCurrentOrRemove(question.id)) {
    event.preventDefault();
    return;
  }

  draggedQuestion.value = question;
  draggedFrom.value = fromZone;
  draggedIndex.value = index;

  // Toggle trash visibility if dragging from current
  if (fromZone === 'current') {
    isDraggingCurrent.value = true;
  }

  // Set drag effect
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", JSON.stringify(question));
  
  // Custom Ghost Proxy for Library drag to solve "Wide Card" illusion
  if (fromZone === 'available' && dragGhost.value) {
     ghostTitle.value = question.question_title;
     
     // Manual DOM update for synchronous drag image generation
     const titleEl = dragGhost.value.querySelector('.ghost-title');
     const typeEl = dragGhost.value.querySelector('.ghost-type');
     const pointsEl = dragGhost.value.querySelector('.ghost-points');
     
     if (titleEl) titleEl.innerText = question.question_title;
     if (typeEl) typeEl.innerText = getQuestionTypeLabel(question.question_type);
     if (pointsEl) pointsEl.innerText = `${question.points} pts`;

     event.dataTransfer.setDragImage(dragGhost.value, 0, 0);
  }
};

const handleDragEnd = () => {
  draggedQuestion.value = null;
  draggedFrom.value = null;
  draggedIndex.value = null;
  dragOverZone.value = null;
  
  // Reset trash visibility
  isDraggingCurrent.value = false;
};

const handleDragEnter = (zone) => {
  dragOverZone.value = zone;
};

const handleDragLeave = (event) => {
  // Only clear if leaving the container itself, not child elements
  const relatedTarget = event.relatedTarget;
  if (!relatedTarget || !event.currentTarget.contains(relatedTarget)) {
    dragOverZone.value = null;
  }
};



const handleDragOverZone = (event, zone) => {
  event.preventDefault();
  dragOverZone.value = zone;
};

const handleDragOverChild = (event, zone, index) => {
  event.preventDefault();
  event.stopPropagation();
  dragOverZone.value = zone;

  // Handle live reordering when dragging within current zone
  if (
    draggedQuestion.value &&
    draggedFrom.value === "current" &&
    draggedIndex.value !== null &&
    draggedIndex.value !== index
  ) {
    const items = [...currentQuestions.value];
    const [removed] = items.splice(draggedIndex.value, 1);
    items.splice(index, 0, removed);
    currentQuestions.value = items;
    draggedIndex.value = index;
  }
};

const handleDropOnChild = (event, zone, index) => {
  event.preventDefault();
  event.stopPropagation();
  dragOverZone.value = null;

  if (!draggedQuestion.value || !draggedFrom.value) return;

  const from = draggedFrom.value;

  // Adding from available to current at specific position
  if (from === "available" && zone === "current") {
    currentQuestions.value.splice(index, 0, draggedQuestion.value);
    return;
  }

  // Reordering within current is already handled by handleDragOverChild
  if (from === "current" && zone === "current") {
    return;
  }

  // Other cases use the normal drop handler
  handleDrop(event, zone);
};

const handleDrop = (event, to) => {
  event.preventDefault();
  event.stopPropagation();
  dragOverZone.value = null;

  if (!draggedQuestion.value || !draggedFrom.value) return;

  const question = draggedQuestion.value;
  const from = draggedFrom.value;
  const isOriginalQuestion = originalQuestionIds.value.includes(question.id);

  // Validation rules
  if (
    (to === "remove" && from === "available") || // Can't remove questions not in quiz
    (to === "available" && from === "current" && isOriginalQuestion) || // Can't remove original questions
    (from === to && to !== "current") // Same zone (except current for reorder)
  ) {
    return;
  }

  // Remove from all zones (Common start for all moves)
  currentQuestions.value = currentQuestions.value.filter(
    (q) => q.id !== question.id
  );
  toRemoveQuestions.value = toRemoveQuestions.value.filter(
    (q) => q.id !== question.id
  );

  // Handle Logic based on Target
  if (to === "current") {
    // Add to current
    currentQuestions.value.push(question);
  } else if (to === "remove") {
    // Smart Remove Logic:
    // If original -> Add to "Marked for Remove" (to sync with backend)
    // If new -> Do nothing (it's already removed from current above, effectively deleting it)
    if (isOriginalQuestion) {
      toRemoveQuestions.value.push(question);
    }
  }

};

const fetchQuiz = async () => {
  loading.value = true;
  loadError.value = null;

  const result = await getQuizById(route.params.id);

  if (result.success) {
    quiz.value = result.data.data;
    currentQuestions.value = [...(quiz.value.questions || [])];
    originalQuestionIds.value = currentQuestions.value.map((q) => q.id);
    originalQuestionOrder.value = currentQuestions.value.map((q) => q.id);
    toRemoveQuestions.value = [];
  } else {
    loadError.value = result.error;
  }

  loading.value = false;
};

const fetchAllQuestions = async () => {
  await performLibrarySearch();
};

const handleRefresh = async () => {
  syncSuccess.value = false;
  syncError.value = null;
  await fetchQuiz();
  await performLibrarySearch();
};

const handleSync = async () => {
  syncing.value = true;
  syncError.value = null;
  syncSuccess.value = false;

  try {
    const add = currentQuestions.value.map((q) => q.id);
    const remove = toRemoveQuestions.value.map((q) => q.id);

    const result = await bindQuestions(route.params.id, add, remove);

    if (result.success) {
      syncSuccess.value = true;
      // Refresh data
      await fetchQuiz();
      setTimeout(() => {
        syncSuccess.value = false;
      }, 3000);
    } else {
      syncError.value = result.error;
    }
  } catch (e) {
    syncError.value = "An unexpected error occurred";
    console.error(e);
  } finally {
    syncing.value = false;
  }
};

// Mobile interaction helpers
// NOTE: Naming follows specific user request:
// - moveToRemove: Moves from Available -> Current
// - moveToAvailableQuestions: Moves from Current -> To Remove

const moveToRemove = (question) => {
  // Logic: Available -> Current
  if (isQuestionInCurrentOrRemove(question.id)) return;
  currentQuestions.value.push(question);
};

const moveToAvailableQuestions = (question) => {
  // Logic: Current -> To Remove (or just remove if new)
  const isOriginal = originalQuestionIds.value.includes(question.id);

  currentQuestions.value = currentQuestions.value.filter(
    (q) => q.id !== question.id
  );

  if (isOriginal) {
    toRemoveQuestions.value.push(question);
  }
};

const restoreToCurrent = (question) => {
  // Remove from to-remove list
  toRemoveQuestions.value = toRemoveQuestions.value.filter(
    (q) => q.id !== question.id
  );

  // Add back to current
  currentQuestions.value.push(question);
};

onMounted(async () => {
  // Fetch question info first to populate categories
  if (questionInfo.value.categories.length === 0) {
    await getQuestionInfo();
  }
  await fetchQuiz();
  await fetchAllQuestions();
});
</script>
