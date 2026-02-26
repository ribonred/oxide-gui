<template>
  <div class="relative" ref="container">
    <!-- Trigger Button -->
    <button @click="toggleDropdown"
      class="w-full flex items-center justify-between gap-2 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-sm text-left text-gh-text transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gh-accent group hover:border-gh-accent"
      :class="[
        isOpen ? 'border-gh-accent ring-2 ring-gh-accent/20' : '',
        $attrs.class
      ]" type="button">
      <div class="flex items-center gap-2 truncate">
        <!-- Icon Slot/Prop -->
        <component v-if="icon" :is="icon"
          class="h-4 w-4 text-gh-text-muted group-hover:text-gh-accent transition-colors" />

        <span :class="selectedLabel ? 'text-gh-text' : 'text-gh-text-muted'">
          {{ selectedLabel || placeholder }}
        </span>
      </div>

      <!-- Chevron -->
      <svg class="w-4 h-4 text-gh-text-muted transition-transform duration-200"
        :class="{ 'rotate-180 text-gh-accent': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <transition enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95 -translate-y-2"
      enter-to-class="transform opacity-100 scale-100 translate-y-0" leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 -translate-y-2">
      <div v-if="isOpen"
        class="absolute z-50 w-full min-w-[150px] mt-1 bg-gh-bg border border-gh-border rounded-md shadow-xl overflow-hidden ring-1 ring-black ring-opacity-5">
        <ul class="max-h-60 overflow-auto py-1 custom-scrollbar">
          <li v-for="option in normalizedOptions" :key="option.value" @click="selectOption(option.value)"
            class="group flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors" :class="[
              modelValue === option.value
                ? 'bg-gh-accent/10 text-gh-accent font-medium'
                : 'text-gh-text hover:bg-gh-bg-secondary'
            ]">
            <span>{{ option.label }}</span>

            <!-- Checkmark for selected -->
            <svg v-if="modelValue === option.value" class="w-4 h-4 text-gh-accent" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array, // Array of strings or objects { value, label }
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select'
  },
  icon: {
    type: [Object, Function, String],
    default: null
  },
  required: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

// State
const isOpen = ref(false);
const container = ref(null);

// Normalize options
const normalizedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return opt;
    }
    return { value: opt, label: opt };
  });
});

// Display Label
const selectedLabel = computed(() => {
  const selected = normalizedOptions.value.find(opt => opt.value === props.modelValue);
  return selected ? selected.label : '';
});

// Actions
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (value) => {
  emit('update:modelValue', value);
  isOpen.value = false;
};

// Click Outside Logic
const closeOnClickOutside = (e) => {
  if (container.value && !container.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeOnClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', closeOnClickOutside);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-gh-border, #e1e4e8);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-gh-text-muted, #959da5);
}
</style>
