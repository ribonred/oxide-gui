<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header Section -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
    >
      <h1 class="text-3xl md:text-4xl font-bold text-gh-text">
        Participants
      </h1>

      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <!-- Export Button -->
        <Button
          variant="secondary"
          @click="handleExport"
          :disabled="exporting"
          class="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {{ exporting ? "Exporting..." : "Export CSV" }}
        </Button>

        <!-- Import Button -->
        <Button
          variant="secondary"
          @click="showImportModal = true"
          class="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Import CSV
        </Button>

        <!-- Add Participant Button -->
        <Button
          variant="primary"
          @click="openCreate"
          class="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Participant
        </Button>
      </div>
    </div>

    <div
      class="bg-gh-card border border-gh-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-250px)] sm:h-[calc(100vh-180px)]"
    >
      <div
        class="p-4 border-b border-gh-border flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gh-card"
      >
        <div class="relative flex-1">
          <SearchInput
            v-model="searchQuery"
            placeholder="Search participants..."
            class="w-full"
          />
        </div>

        <!-- develop later -->
        <div class="relative">
          <button
            @click="showFilter = !showFilter"
            class="relative w-full sm:w-auto inline-flex justify-center items-center gap-2 px-3 py-2 border border-gh-border rounded-lg hover:bg-gh-bg-secondary text-gh-text text-sm font-medium transition-colors"
            :class="{
              'border-gh-accent bg-gh-accent/10': hasActiveFilters,
            }"
          >
            <span
              v-if="hasActiveFilters"
              class="absolute -top-1 -right-1 flex h-3 w-3"
            >
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gh-accent opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-3 w-3 bg-gh-accent border-2 border-gh-card"
              ></span>
            </span>

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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>

            <span>Filter</span>

            <svg
              class="w-3 h-3 ml-1 transition-transform"
              :class="{ 'rotate-180': showFilter }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" stroke-width="2" />
            </svg>
          </button>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showFilter"
              class="absolute right-0 mt-2 w-72 bg-gh-card border border-gh-border rounded-lg shadow-xl z-30 overflow-hidden"
            >
              <div class="p-4 space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-gh-text-muted uppercase mb-2">Created Date</label>
                  <div class="space-y-2">
                    <DateTimePicker
                      v-model="dateFilter.start"
                      placeholder="Start Date"
                      :show-display="false"
                      @update:modelValue="handleFilterChange"
                    />
                    <DateTimePicker
                      v-model="dateFilter.end"
                      placeholder="End Date"
                      :show-display="false"
                      @update:modelValue="handleFilterChange"
                    />
                  </div>
                </div>

                <!-- Future filters can go here -->

              </div>
              <div
                v-if="hasActiveFilters"
                class="border-t border-gh-border p-2 bg-gh-bg-secondary"
              >
                <button
                  @click="clearFilters"
                  class="w-full text-center px-3 py-1.5 text-xs text-red-400 font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="flex-1 overflow-auto relative bg-gh-bg">
        <div v-if="loading" class="p-8 text-center text-gh-text-muted">
          Loading participants...
        </div>

        <div v-else-if="error" class="p-4 text-gh-text bg-gh-bg border border-gh-border m-4 rounded-lg">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-gh-text">{{ error }}</span>
          </div>
        </div>

        <table v-else class="min-w-full divide-y divide-gh-border">
          <thead class="bg-gh-bg-secondary sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-semibold text-gh-text-muted uppercase tracking-wider w-20"
              >
                ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-semibold text-gh-text-muted uppercase tracking-wider"
              >
                Alias / Email
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-semibold text-gh-text-muted uppercase tracking-wider hidden sm:table-cell"
              >
                External ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-semibold text-gh-text-muted uppercase tracking-wider hidden md:table-cell"
              >
                Created At
              </th>
              <th scope="col" class="relative px-6 py-3 w-24">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-gh-card divide-y divide-gh-border">
            <tr
              v-for="participant in participants"
              :key="participant.id"
              class="hover:bg-gh-bg-secondary transition-colors group"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gh-text-muted font-mono"
              >
                {{ participant.id }}
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-9 w-9 rounded-full bg-gh-bg-secondary flex items-center justify-center text-xs font-bold text-gh-muted border border-gh-border"
                  >
                    {{ participant.alias.charAt(0).toUpperCase() }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gh-text">
                      {{ participant.alias }}
                    </div>
                    <div class="text-sm text-gh-text-muted">
                      {{ participant.email || "No email provided" }}
                    </div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gh-bg-secondary text-gh-text border border-gh-border"
                >
                  {{ participant.external_id }}
                </span>
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gh-text-muted hidden md:table-cell"
              >
                {{ formatDate(participant.created_at) }}
              </td>

              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <div
                  class="flex items-center justify-end gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                >
                  <NuxtLink
                    :to="`/participants/${participant.id}`"
                    class="text-gh-accent hover:text-white p-1.5 hover:bg-gh-accent rounded-md transition-colors"
                    title="View Details"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </NuxtLink>
                  <button
                    @click="openEdit(participant)"
                    class="text-gh-accent hover:text-white p-1.5 hover:bg-gh-accent rounded-md transition-colors"
                    title="Edit"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                      />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(participant)"
                    class="text-red-400 hover:text-white p-1.5 hover:bg-red-500 rounded-md transition-colors"
                    title="Delete"
                  > 
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                      ></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="participants.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gh-text-muted">
                <div class="flex flex-col items-center justify-center">
                  <svg
                    class="w-12 h-12 text-gh-muted mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p class="text-base font-medium text-gh-text">
                    No participants found
                  </p>
                  <p class="text-sm mt-1">
                    Try adjusting your search query or add a new one.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="px-6 py-4 border-t border-gh-border flex items-center justify-between bg-gh-bg-secondary"
      >
        <span class="text-sm text-gh-text-muted">
          Showing
          <span class="font-medium text-gh-text">{{
            participants.length > 0 ? (pagination.page - 1) * pagination.perPage + 1 : 0
          }}</span>
          to
          <span class="font-medium text-gh-text">{{
            Math.min(pagination.page * pagination.perPage, pagination.total)
          }}</span>
          of
          <span class="font-medium text-gh-text">{{
            pagination.total
          }}</span>
          results
        </span>
        <div class="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            :disabled="pagination.page === 1 || loading"
            @click="
              pagination.page--;
              fetchParticipants();
            "
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="secondary"
            :disabled="pagination.page >= pagination.totalPages || loading"
            @click="
              pagination.page++;
              fetchParticipants();
            "
          >
            Next
          </Button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal
      v-model="showDeleteModal"
      title="Delete Participant"
      size="sm"
    >
      <p class="text-gh-text">
        Are you sure you want to delete <span class="font-bold">{{ participantToDelete?.alias }}</span>? 
        This action cannot be undone.
      </p>
      
      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <Button
            variant="secondary"
            @click="showDeleteModal = false"
            :disabled="deleting"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            @click="handleDelete"
            :disabled="deleting"
          >
            {{ deleting ? "Deleting..." : "Delete" }}
          </Button>
        </div>
      </template>
    </Modal>

    <Drawer
      :is-open="isDrawerOpen"
      :mode="drawerMode"
      :initial-data="selectedParticipant"
      :error="drawerError"
      :submitting="drawerSubmitting"
      @close="isDrawerOpen = false"
      @save="handleSave"
    />

    <!-- Import Modal -->
    <ImportModal
      v-model="showImportModal"
      @imported="handleImportSuccess"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import Drawer from "./drawer.vue";
import ImportModal from "./ImportModal.vue";
import SearchInput from '~/components/ui/SearchInput.vue'
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import Modal from "@/components/ui/Modal.vue";
import DateTimePicker from "@/components/ui/DateTimePicker.vue";

const {
  getParticipants,
  createParticipant,
  updateParticipant,
  deleteParticipant,
  exportParticipantsCsv,
  searchParticipants,
} = useParticipants();

// --- State & Data ---
const searchQuery = ref("");
const showFilter = ref(false); // State to toggle filter menu
const dateFilter = ref({ start: null, end: null });
const isDrawerOpen = ref(false);
const drawerMode = ref("create");
const selectedParticipant = ref({});
const showDeleteModal = ref(false);
const participantToDelete = ref(null);
const deleting = ref(false);
const showImportModal = ref(false);
const exporting = ref(false);

const participants = ref([]);
const loading = ref(true);
const error = ref(null);

const drawerError = ref(null);
const drawerSubmitting = ref(false);

const pagination = ref({
  page: 1,
  perPage: 10,
  total: 0,
  totalPages: 1,
});

const fetchParticipants = async () => {
  loading.value = true;
  error.value = null;

  const filters = {
    page: pagination.value.page,
    perPage: pagination.value.perPage,
    query: searchQuery.value || undefined,
    from: dateFilter.value.start ? new Date(dateFilter.value.start).toISOString() : undefined,
    to: dateFilter.value.end ? new Date(dateFilter.value.end).toISOString() : undefined,
  };

  const result = await searchParticipants(filters);

  if (result.success) {
    participants.value = result.data.data?.results || [];

    const meta = result.data.data?.pagination;
    if (meta) {
      pagination.value.total = meta.totalItems; // Note: API type says totalItems, verify backend
      pagination.value.totalPages = meta.totalPages;
      pagination.value.page = meta.currentPage;
    }
  } else {
    error.value = result.error;
  }

  loading.value = false;
};

onMounted(() => {
  fetchParticipants();
});

const handleSave = async (payload) => {
  drawerError.value = null;
  drawerSubmitting.value = true;

  const result =
    drawerMode.value === "create"
      ? await createParticipant(payload)
      : await updateParticipant(selectedParticipant.value.id, payload);

  if (result.success) {
    await fetchParticipants();
    isDrawerOpen.value = false;
  } else {
    drawerError.value = result.error;
  }

  drawerSubmitting.value = false;
};

const confirmDelete = (participant) => {
  participantToDelete.value = participant;
  showDeleteModal.value = true;
};

const handleDelete = async () => {
  if (!participantToDelete.value) return;

  deleting.value = true;

  const result = await deleteParticipant(participantToDelete.value.id);

  if (result.success) {
    fetchParticipants();
    showDeleteModal.value = false;
    participantToDelete.value = null;
  } else {
    showAlert('Delete Failed', result.error || 'Failed to delete participant.', 'error')
  }

  deleting.value = false;
};

// --- Computed Filter Logic ---
const hasActiveFilters = computed(() => {
  return !!dateFilter.value.start || !!dateFilter.value.end;
});

const handleFilterChange = () => {
  pagination.value.page = 1;
  fetchParticipants();
};

const clearFilters = () => {
  dateFilter.value = { start: null, end: null };
  handleFilterChange();
}

let searchTimeout;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1;
    fetchParticipants();
  }, 500);
});

// --- Methods ---
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const openCreate = () => {
  drawerMode.value = "create";
  selectedParticipant.value = {};
  isDrawerOpen.value = true;
};
const openEdit = (p) => {
  drawerMode.value = "edit";
  selectedParticipant.value = { ...p };
  isDrawerOpen.value = true;
};

// --- Export & Import ---
const handleExport = async () => {
  exporting.value = true;
  const result = await exportParticipantsCsv();
  if (!result.success) {
    error.value = result.error || "Failed to export participants";
  }
  exporting.value = false;
};

const handleImportSuccess = () => {
  fetchParticipants();
};
</script>

<style scoped>
/* Optional: Scrollbar customizations for better UI */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-gh-border);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-gh-muted);
}
</style>
