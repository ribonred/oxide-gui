<template>
  <div class="relative">
    <div v-if="label" class="block text-gh-text text-sm font-medium mb-2">
      {{ label }}
    </div>
    
    <div 
      class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus-within:ring-2 focus-within:ring-gh-accent flex flex-wrap gap-2 items-center min-h-[42px]"
      @click="focusInput"
    >
      <!-- Tags -->
      <div 
        v-for="(tag, index) in modelValue" 
        :key="index"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gh-accent/10 text-gh-accent border border-gh-accent/20"
      >
        {{ tag }}
        <button 
          type="button"
          class="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 items-center justify-center rounded-full hover:bg-gh-accent/20 focus:outline-none"
          @click.stop="removeTag(index)"
        >
          <span class="sr-only">Remove tag</span>
          <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Input -->
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        class="bg-transparent border-none outline-none flex-1 min-w-[120px] text-gh-text placeholder-gh-muted focus:ring-0 p-0"
        @keydown.enter.prevent="addTag"
        @keydown.backspace="handleBackspace"
        @blur="addTag"
      />
    </div>
    <p v-if="hint" class="mt-1 text-xs text-gh-muted">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Add a tag...'
  },
  hint: {
    type: String,
    default: 'Press Enter or blur to add tag'
  }
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const focusInput = () => {
  inputRef.value?.focus();
};

const addTag = () => {
  const val = inputValue.value.trim();
  if (val) {
    if (!props.modelValue.includes(val)) {
      emit('update:modelValue', [...props.modelValue, val]);
    }
    inputValue.value = '';
  }
};

const removeTag = (index: number) => {
  const newTags = [...props.modelValue];
  newTags.splice(index, 1);
  emit('update:modelValue', newTags);
};

const handleBackspace = () => {
  if (inputValue.value === '' && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1);
  }
};
</script>
