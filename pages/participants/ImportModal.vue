<template>
  <Modal v-model="isOpen" title="Import Participants" size="md">
    <div class="space-y-4">
      <!-- File Upload Area -->
      <div
        class="border-2 border-dashed border-gh-border rounded-lg p-6 text-center transition-colors"
        :class="{
          'border-gh-accent bg-gh-accent/5': isDragging,
          'hover:border-gh-muted': !isDragging,
        }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          class="hidden"
          @change="handleFileSelect"
        />

        <div v-if="!selectedFile">
          <svg
            class="w-12 h-12 mx-auto text-gh-muted mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p class="text-gh-text font-medium mb-1">
            Drop your CSV file here, or
            <button
              type="button"
              class="text-gh-accent hover:underline"
              @click="fileInput?.click()"
            >
              browse
            </button>
          </p>
          <p class="text-sm text-gh-muted">Supports .csv files only</p>
        </div>

        <div v-else class="flex items-center justify-center gap-3">
          <svg
            class="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="text-left">
            <p class="text-gh-text font-medium">{{ selectedFile.name }}</p>
            <p class="text-sm text-gh-muted">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
          <button
            type="button"
            class="ml-2 text-gh-muted hover:text-red-400 transition-colors"
            @click="clearFile"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- CSV Format Info -->
      <div class="bg-gh-bg-secondary border border-gh-border rounded-lg p-4">
        <h4 class="text-sm font-semibold text-gh-text mb-2">CSV Format</h4>
        <p class="text-sm text-gh-muted mb-2">
          Your CSV file should have the following columns:
        </p>
        <div class="bg-gh-bg rounded p-2 font-mono text-xs text-gh-text overflow-x-auto">
          alias,external_id,email,metadata.department,metadata.class
        </div>
        <div class="mt-3 space-y-1">
          <p class="text-xs text-gh-muted">
            <strong class="text-gh-text">Required:</strong> alias, external_id
          </p>
          <p class="text-xs text-gh-muted">
            <strong class="text-gh-text">Optional:</strong> email
          </p>
          <p class="text-xs text-gh-muted">
            <strong class="text-gh-text">Metadata:</strong> Add custom fields with <code class="bg-gh-bg px-1 rounded">metadata.</code> prefix (e.g., metadata.department, metadata.grade)
          </p>
        </div>
        
        <!-- Example -->
        <div class="mt-3 pt-3 border-t border-gh-border">
          <p class="text-xs font-medium text-gh-text mb-1">Example:</p>
          <div class="bg-gh-bg rounded p-2 font-mono text-xs text-gh-muted overflow-x-auto whitespace-pre">alias,external_id,email,metadata.department
John Doe,EXT001,john@example.com,Engineering
Jane Smith,EXT002,jane@example.com,Sales</div>
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2"
      >
        <svg
          class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-sm text-red-400">{{ error }}</p>
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start gap-2"
      >
        <svg
          class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-sm text-green-400">{{ successMessage }}</p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <Button variant="secondary" @click="handleClose" :disabled="importing">
          Cancel
        </Button>
        <Button
          variant="primary"
          @click="handleImport"
          :disabled="!selectedFile || importing"
        >
          {{ importing ? "Importing..." : "Import" }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Modal from "@/components/ui/Modal.vue";
import Button from "@/components/ui/Button.vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "imported"): void;
}>();

const { bulkImportParticipantsCsv } = useParticipants();

const isOpen = ref(props.modelValue);
const isDragging = ref(false);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const importing = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val;
    if (val) {
      // Reset state when modal opens
      selectedFile.value = null;
      error.value = null;
      successMessage.value = null;
    }
  }
);

watch(isOpen, (val) => {
  emit("update:modelValue", val);
});

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.name.endsWith(".csv")) {
      selectedFile.value = file;
      error.value = null;
    } else {
      error.value = "Please select a CSV file";
    }
  }
};

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
    error.value = null;
  }
};

const clearFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const handleImport = async () => {
  if (!selectedFile.value) return;

  importing.value = true;
  error.value = null;
  successMessage.value = null;

  const result = await bulkImportParticipantsCsv(selectedFile.value);

  if (result.success) {
    successMessage.value = "Participants imported successfully!";
    emit("imported");
    // Close modal after short delay
    setTimeout(() => {
      isOpen.value = false;
    }, 1500);
  } else {
    error.value = result.error || "Failed to import participants";
  }

  importing.value = false;
};

const handleClose = () => {
  isOpen.value = false;
};
</script>
