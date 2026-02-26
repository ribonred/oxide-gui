<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
    @click="$emit('close')"
  ></div>

  <transition
    enter-active-class="transform transition ease-in-out duration-300"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transform transition ease-in-out duration-300"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div
      v-if="isOpen"
      class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-gh-card shadow-2xl flex flex-col border-l border-gh-border"
    >
      <!-- Header -->
      <div
        class="px-6 py-4 border-b border-gh-border flex justify-between items-start bg-gh-card"
      >
        <div>
          <h2 class="text-lg font-bold text-gh-text">
            {{ mode === "create" ? "New Participant" : "Edit Participant" }}
          </h2>
          <p class="text-sm text-gh-text-muted mt-1">
            Fill in the details below to manage access.
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gh-muted hover:text-gh-text hover:bg-gh-bg p-1 rounded-full transition-colors"
        >
          <svg
            class="w-6 h-6"
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

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6 bg-gh-card text-gh-text">
        <div
          v-if="formError || error"
          class="mb-4 rounded-lg bg-gh-accent/10 border border-gh-accent p-3"
        >
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gh-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-gh-text">
              {{ formError || error }}
            </p>
          </div>
        </div>
        
        <form
          @submit.prevent="handleSubmit"
          id="participant-form"
          class="space-y-5"
        >
          <Input 
            v-model="formData.alias"
            label="Alias"
            placeholder="e.g. John Doe"
            required
            :error="formError && !formData.alias ? 'Alias is required' : null"
          />

          <Input 
            v-model="formData.external_id"
            label="External ID"
            placeholder="Unique System ID"
            required
            :disabled="mode === 'edit'"
            :error="formError && !formData.external_id ? 'External ID is required' : null"
            hint="Used to identify users from your system"
          />

          <Input 
            v-model="formData.email"
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            optional
          />

          <Textarea
            v-model="formData.metadata"
            label="Metadata"
            placeholder='{"role": "student"}'
            :rows="4"
            hint="JSON format required"
            class="font-mono text-sm"
          />
        </form>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-4 border-t border-gh-border bg-gh-bg-secondary flex justify-end space-x-3"
      >
        <Button
          variant="secondary"
          @click="$emit('close')"
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          form="participant-form"
          variant="primary"
          :disabled="submitting"
        >
          {{
            submitting
              ? "Saving..."
              : mode === "create"
              ? "Create Participant"
              : "Save Changes"
          }}
        </Button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from "vue";
import Input from "@/components/ui/Input.vue";
import Textarea from "@/components/ui/Textarea.vue";
import Button from "@/components/ui/Button.vue";

const props = defineProps({
  isOpen: Boolean,
  mode: { type: String, default: "create" },
  initialData: { type: Object, default: () => ({}) },
  error: { type: String, default: null }, // API error from parent
  submitting: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "save"]);

const formData = ref({
  alias: "",
  external_id: "",
  email: "",
  metadata: "",
});

const formError = ref(null);

/* =========================
 * Sync form on open
 * ========================= */
watch(
  () => props.isOpen,
  (open) => {
    if (!open) return;

    formError.value = null;

    if (props.mode === "edit" && props.initialData) {
      formData.value = { ...props.initialData };

      if (typeof formData.value.metadata === "object") {
        formData.value.metadata = JSON.stringify(
          formData.value.metadata,
          null,
          2
        );
      }
    } else {
      formData.value = {
        alias: "",
        external_id: "",
        email: "",
        metadata: "",
      };
    }
  }
);

/* =========================
 * Validation + normalize
 * ========================= */
const handleSubmit = () => {
  formError.value = null;

  if (!formData.value.alias.trim()) {
    formError.value = "Alias is required";
    return;
  }

  if (props.mode === "create" && !formData.value.external_id.trim()) {
    formError.value = "External ID is required";
    return;
  }

  let parsedMetadata = null;

  if (formData.value.metadata) {
    try {
      parsedMetadata = JSON.parse(formData.value.metadata);
    } catch {
      formError.value = "Metadata must be valid JSON";
      return;
    }
  }

  emit("save", {
    alias: formData.value.alias.trim(),
    external_id: formData.value.external_id?.trim(),
    email: formData.value.email || null,
    metadata: parsedMetadata,
  });
};
</script>
